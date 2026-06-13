<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\CompraDetalle;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\VentaDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TraspasoController extends Controller
{
    /**
     * Obtener productos disponibles para traspaso de una farmacia
     * Retorna los lotes (compra_detalles) con stock disponible, agrupados por producto
     */
    public function getProductos(Request $request)
    {
        $farmacia_tipo = $request->query('farmacia_tipo', 'Farmacia');
        $search = trim((string) $request->query('search', ''));
        $perPage = (int) $request->query('per_page', 12);

        $productos = Producto::query()
            ->select([
                'productos.id',
                'productos.nombre',
                'productos.precio',
                'productos.unidad',
                'productos.imagen',
                'productos.stock',
                'productos.farmacia_tipo',
            ])
            ->where('productos.farmacia_tipo', $farmacia_tipo)
            ->withSum(
                ['comprasDetalles as cantidad' => function ($query) use ($farmacia_tipo) {
                    $query->where('estado', 'Activo')
                        ->where('farmacia_tipo', $farmacia_tipo)
                        ->where('cantidad_venta', '>', 0);
                }],
                'cantidad_venta'
            )
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nested) use ($search) {
                    $nested->where('productos.nombre', 'like', "%{$search}%")
                        ->orWhere('productos.descripcion', 'like', "%{$search}%");
                    if (is_numeric($search)) {
                        $nested->orWhere('productos.id', (int) $search);
                    }
                });
            })
            ->having('cantidad', '>', 0)
            ->orderBy('productos.nombre')
            ->paginate($perPage);

        $productos->getCollection()->transform(function ($producto) {
            $producto->stock_registrado = (float) ($producto->stock ?? 0);
            $producto->stock = $producto->cantidad;

            return $producto;
        });

        return response()->json($productos);
    }

    /**
     * Obtener lotes disponibles de un producto
     */
    public function getLotes(Request $request)
    {
        $producto_id = $request->query('producto_id');
        $farmacia_tipo = $request->query('farmacia_tipo', 'Farmacia');

        $lotes = CompraDetalle::where('producto_id', $producto_id)
            ->where('farmacia_tipo', $farmacia_tipo)
            ->where('cantidad_venta', '>', 0)
            ->where('estado', 'Activo')
            ->select('id', 'lote as numero_lote', 'fecha_vencimiento', 'cantidad_venta as cantidad', 'precio')
            ->get();

        return response()->json($lotes);
    }

    /**
     * Crear un traspaso entre farmacias
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'farmacia_origen' => 'required|string',
            'farmacia_destino' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.compra_detalle_id' => 'required|exists:compra_detalles,id',
            'items.*.cantidad' => 'required|numeric|min:1',
            'observaciones' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $user_id = auth()->id();
            $fecha = now()->format('Y-m-d');
            $hora = now()->format('H:i:s');

            // Crear VENTA en farmacia origen (sin cliente, tipo Traspaso)
            $venta = Venta::create([
                'user_id' => $user_id,
                'cliente_id' => null,
                'fecha' => $fecha,
                'hora' => $hora,
                'tipo_venta' => 'Interno',
                'ci' => null,
                'nombre' => 'Traspaso a '.$validated['farmacia_destino'],
                'estado' => 'Activo',
                'tipo_comprobante' => 'Venta',
                'total' => 0,
                'tipo_pago' => 'Traspaso',
                'pagado_interno' => true,
                'tipo' => 'Traspaso',
                'farmacia_tipo' => $validated['farmacia_origen'],
            ]);

            // Crear COMPRA en farmacia destino (sin proveedor, tipo Traspaso)
            $compra = Compra::create([
                'user_id' => $user_id,
                'proveedor_id' => null,
                'fecha' => $fecha,
                'hora' => $hora,
                'ci' => null,
                'nombre' => 'Traspaso desde '.$validated['farmacia_origen'],
                'estado' => 'Activo',
                'total' => 0,
                'tipo_pago' => 'Traspaso',
                'nro_factura' => null,
                'tipo' => 'Traspaso',
                'traspaso_venta_id' => null, // Se actualiza después
                'farmacia_tipo' => $validated['farmacia_destino'],
            ]);

            // Actualizar referencias cruzadas
            $venta->update(['traspaso_compra_id' => $compra->id]);
            $compra->update(['traspaso_venta_id' => $venta->id]);

            $totalVenta = 0;
            $totalCompra = 0;

            // Procesar cada item
            foreach ($validated['items'] as $item) {
                $compraDetalleOrigen = CompraDetalle::where('id', $item['compra_detalle_id'])
                    ->where('farmacia_tipo', $validated['farmacia_origen'])
                    ->where('estado', 'Activo')
                    ->lockForUpdate()
                    ->firstOrFail();
                $cantidad = (float) $item['cantidad'];

                // Validar que haya suficiente cantidad
                if (($compraDetalleOrigen->cantidad_venta ?? 0) < $cantidad) {
                    $loteLabel = $compraDetalleOrigen->lote ?: 'sin lote';
                    $vencimientoLabel = $compraDetalleOrigen->fecha_vencimiento ?: 'sin vencimiento';
                    throw new \Exception("Stock insuficiente para el lote {$loteLabel} ({$vencimientoLabel}). Disponible: {$compraDetalleOrigen->cantidad_venta}, solicitado: {$cantidad}");
                }

                $subtotal = $cantidad * $compraDetalleOrigen->precio;
                $totalVenta += $subtotal;
                $totalCompra += $subtotal;

                $productoOrigen = Producto::where('id', $compraDetalleOrigen->producto_id)
                    ->where('farmacia_tipo', $validated['farmacia_origen'])
                    ->first();

                if (! $productoOrigen) {
                    throw new \Exception('Producto origen no encontrado para el traspaso');
                }

                $cloneProducto = Producto::where('nombre', $productoOrigen->nombre)
                    ->where('farmacia_tipo', $validated['farmacia_destino'])
                    ->first();

                if (! $cloneProducto) {
                    $cloneProducto = Producto::create([
                        'nombre' => $productoOrigen->nombre,
                        'imagen' => $productoOrigen->imagen,
                        'farmacia_tipo' => $validated['farmacia_destino'],
                        'descripcion' => $productoOrigen->descripcion,
                        'unidad' => $productoOrigen->unidad,
                        'precio' => $productoOrigen->precio,
                        'stock' => 0,
                        'stock_minimo' => $productoOrigen->stock_minimo,
                        'stock_maximo' => $productoOrigen->stock_maximo,
                    ]);
                }

                // Crear detalle de VENTA
                VentaDetalle::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $compraDetalleOrigen->producto_id,
                    'compra_detalle_id' => $compraDetalleOrigen->id,
                    'nombre' => $productoOrigen->nombre,
                    'cantidad' => $cantidad,
                    'unidad' => $productoOrigen->unidad,
                    'precio' => $compraDetalleOrigen->precio,
                    'lote' => $compraDetalleOrigen->lote,
                    'fecha_vencimiento' => $compraDetalleOrigen->fecha_vencimiento,
                    'farmacia_tipo' => $validated['farmacia_origen'],
                ]);

                // Crear detalle de COMPRA
                CompraDetalle::create([
                    'compra_id' => $compra->id,
                    'user_id' => $user_id,
                    'producto_id' => $cloneProducto->id,
                    'nombre' => $cloneProducto->nombre,
                    'cantidad' => $cantidad,
                    'cantidad_venta' => $cantidad,
                    'precio' => $compraDetalleOrigen->precio,
                    'total' => $subtotal,
                    'lote' => $compraDetalleOrigen->lote,
                    'fecha_vencimiento' => $compraDetalleOrigen->fecha_vencimiento,
                    'farmacia_tipo' => $validated['farmacia_destino'],
                    'estado' => 'Activo',
                    'precio_venta' => $cloneProducto->precio,
                ]);

                // Disminuir stock en farmacia origen
                $compraDetalleOrigen->update([
                    'cantidad' => max(0, (float) $compraDetalleOrigen->cantidad - $cantidad),
                    'cantidad_venta' => max(0, (float) ($compraDetalleOrigen->cantidad_venta ?? 0) - $cantidad),
                ]);

                // Actualizar stock de producto en farmacia origen
                $productoOrigen->update([
                    'stock' => max(0, (float) $productoOrigen->stock - $cantidad),
                ]);

                $cloneProducto->update([
                    'stock' => (float) $cloneProducto->stock + $cantidad,
                ]);
            }

            // Actualizar totales
            $venta->update(['total' => $totalVenta]);
            $compra->update(['total' => $totalCompra]);

            DB::commit();

            $venta->load(['user', 'ventaDetalles.producto']);
            $compra->load(['compraDetalles.producto']);

            return response()->json([
                'message' => 'Traspaso realizado exitosamente',
                'venta_id' => $venta->id,
                'compra_id' => $compra->id,
                'traspaso' => [
                    'id' => $venta->id,
                    'fecha' => $venta->fecha,
                    'hora' => $venta->hora,
                    'nombre' => $venta->nombre,
                    'estado' => $venta->estado,
                    'total' => $venta->total,
                    'farmacia_origen' => $venta->farmacia_tipo,
                    'farmacia_destino' => $compra->farmacia_tipo,
                    'user' => $venta->user,
                    'venta_detalles' => $venta->ventaDetalles,
                    'detailsText' => $venta->detailsText,
                    'comentario' => $validated['observaciones'] ?? '',
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Error: '.$e->getMessage()], 400);
        }
    }

    /**
     * Listar traspasos
     */
    public function index(Request $request)
    {
        $farmacia_tipo = $request->query('farmacia_tipo', 'Farmacia');

        $traspasos = Venta::with(['user', 'ventaDetalles.producto'])
            ->where('tipo', 'Traspaso')
            ->where('farmacia_tipo', $farmacia_tipo)
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Venta $venta) {
                $compra = Compra::find($venta->traspaso_compra_id);

                return [
                    'venta_id' => $venta->id,
                    'compra_id' => $venta->traspaso_compra_id,
                    'nombre' => $venta->nombre,
                    'fecha' => $venta->fecha,
                    'hora' => $venta->hora,
                    'estado' => $venta->estado,
                    'total' => $venta->total,
                    'farmacia_origen' => $venta->farmacia_tipo,
                    'farmacia_destino' => $compra?->farmacia_tipo,
                    'user' => $venta->user,
                    'detailsText' => $venta->detailsText,
                    'venta_detalles' => $venta->ventaDetalles,
                    'comentario' => $venta->comentario,
                ];
            })
            ->values();

        return response()->json($traspasos);
    }

    /**
     * Anular un traspaso
     */
    public function anular($ventaId)
    {
        try {
            DB::beginTransaction();

            // Obtener la venta (origen del traspaso)
            $venta = Venta::where('id', $ventaId)->lockForUpdate()->firstOrFail();

            if ($venta->tipo !== 'Traspaso') {
                throw new \Exception('Esta venta no es un traspaso');
            }

            if ($venta->estado === 'Anulado') {
                throw new \Exception('Este traspaso ya fue anulado');
            }

            // Obtener la compra vinculada (destino del traspaso)
            $compra = Compra::where('id', $venta->traspaso_compra_id)->lockForUpdate()->first();
            if (! $compra) {
                throw new \Exception('No se encontró la compra vinculada');
            }

            // Procesar cada detalle para revertir stock
            $ventaDetalles = VentaDetalle::with('producto')
                ->where('venta_id', $venta->id)
                ->get();

            foreach ($ventaDetalles as $ventaDetalle) {
                $cantidad = (float) $ventaDetalle->cantidad;
                $productoNombre = $ventaDetalle->producto?->nombre ?: $ventaDetalle->nombre;
                $loteLabel = $ventaDetalle->lote ?: 'sin lote';

                $compraDetalleOrigenExacto = CompraDetalle::where('id', $ventaDetalle->compra_detalle_id)
                    ->where('farmacia_tipo', $venta->farmacia_tipo)
                    ->lockForUpdate()
                    ->first();

                if (! $compraDetalleOrigenExacto) {
                    throw new \Exception("No se encontro el lote origen {$loteLabel} del producto {$productoNombre}");
                }

                $compraDetalleDestinoExacto = CompraDetalle::where('compra_id', $compra->id)
                    ->where('farmacia_tipo', $compra->farmacia_tipo)
                    ->where('nombre', $ventaDetalle->nombre)
                    ->where(function ($query) use ($ventaDetalle) {
                        if ($ventaDetalle->lote === null || $ventaDetalle->lote === '') {
                            $query->whereNull('lote')->orWhere('lote', '');

                            return;
                        }

                        $query->where('lote', $ventaDetalle->lote);
                    })
                    ->when(
                        $ventaDetalle->fecha_vencimiento,
                        fn ($query) => $query->where('fecha_vencimiento', $ventaDetalle->fecha_vencimiento),
                        fn ($query) => $query->whereNull('fecha_vencimiento')
                    )
                    ->lockForUpdate()
                    ->first();

                if (! $compraDetalleDestinoExacto) {
                    throw new \Exception("No se encontro el lote destino {$loteLabel} del producto {$productoNombre}");
                }

                if ((float) ($compraDetalleDestinoExacto->cantidad_venta ?? 0) < $cantidad) {
                    throw new \Exception("No se puede anular: el destino ya no tiene {$cantidad} disponible del producto {$productoNombre}, lote {$loteLabel}");
                }

                $compraDetalleOrigenExacto->update([
                    'cantidad' => (float) $compraDetalleOrigenExacto->cantidad + $cantidad,
                    'cantidad_venta' => (float) ($compraDetalleOrigenExacto->cantidad_venta ?? 0) + $cantidad,
                ]);

                $productoOrigenExacto = Producto::where('id', $ventaDetalle->producto_id)
                    ->where('farmacia_tipo', $venta->farmacia_tipo)
                    ->lockForUpdate()
                    ->first();

                if ($productoOrigenExacto) {
                    $productoOrigenExacto->update([
                        'stock' => (float) $productoOrigenExacto->stock + $cantidad,
                    ]);
                }

                $compraDetalleDestinoExacto->update([
                    'cantidad' => max(0, (float) $compraDetalleDestinoExacto->cantidad - $cantidad),
                    'cantidad_venta' => max(0, (float) ($compraDetalleDestinoExacto->cantidad_venta ?? 0) - $cantidad),
                ]);

                $productoDestinoExacto = Producto::where('id', $compraDetalleDestinoExacto->producto_id)
                    ->where('farmacia_tipo', $compra->farmacia_tipo)
                    ->lockForUpdate()
                    ->first();

                if ($productoDestinoExacto) {
                    $productoDestinoExacto->update([
                        'stock' => max(0, (float) $productoDestinoExacto->stock - $cantidad),
                    ]);
                }

                if ((float) $compraDetalleDestinoExacto->cantidad <= 0 && (float) ($compraDetalleDestinoExacto->cantidad_venta ?? 0) <= 0) {
                    $compraDetalleDestinoExacto->delete();
                }

            }

            // Marcar como anulado (soft delete o cambiar estado)
            $venta->update(['estado' => 'Anulado']);
            $compra->update(['estado' => 'Anulado']);

            DB::commit();

            return response()->json([
                'message' => 'Traspaso anulado exitosamente',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Error: '.$e->getMessage()], 400);
        }
    }
}
