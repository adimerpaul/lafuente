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
                });
            })
            ->having('cantidad', '>', 0)
            ->orderBy('productos.nombre')
            ->paginate($perPage);

        $productos->getCollection()->transform(function ($producto) {
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
                'nombre' => 'Traspaso a ' . $validated['farmacia_destino'],
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
                'nombre' => 'Traspaso desde ' . $validated['farmacia_origen'],
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
                $compraDetalleOrigen = CompraDetalle::findOrFail($item['compra_detalle_id']);
                $cantidad = $item['cantidad'];

                // Validar que haya suficiente cantidad
                if (($compraDetalleOrigen->cantidad_venta ?? 0) < $cantidad) {
                    throw new \Exception("Stock insuficiente para el lote {$compraDetalleOrigen->lote}");
                }

                $subtotal = $cantidad * $compraDetalleOrigen->precio;
                $totalVenta += $subtotal;
                $totalCompra += $subtotal;

                $productoOrigen = Producto::where('id', $compraDetalleOrigen->producto_id)
                    ->where('farmacia_tipo', $validated['farmacia_origen'])
                    ->first();

                if (!$productoOrigen) {
                    throw new \Exception('Producto origen no encontrado para el traspaso');
                }

                $cloneProducto = Producto::where('nombre', $productoOrigen->nombre)
                    ->where('farmacia_tipo', $validated['farmacia_destino'])
                    ->first();

                if (!$cloneProducto) {
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
                    'cantidad' => $compraDetalleOrigen->cantidad - $cantidad,
                    'cantidad_venta' => max(0, ($compraDetalleOrigen->cantidad_venta ?? 0) - $cantidad)
                ]);

                // Actualizar stock de producto en farmacia origen
                $productoOrigen->update([
                    'stock' => max(0, $productoOrigen->stock - $cantidad)
                ]);

                $cloneProducto->update([
                    'stock' => $cloneProducto->stock + $cantidad
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
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 400);
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
            $venta = Venta::findOrFail($ventaId);
            
            if ($venta->tipo !== 'Traspaso') {
                throw new \Exception('Esta venta no es un traspaso');
            }

            // Obtener la compra vinculada (destino del traspaso)
            $compra = Compra::find($venta->traspaso_compra_id);
            if (!$compra) {
                throw new \Exception('No se encontró la compra vinculada');
            }

            // Procesar cada detalle para revertir stock
            $ventaDetalles = VentaDetalle::where('venta_id', $venta->id)->get();
            
            foreach ($ventaDetalles as $ventaDetalle) {
                // Revertir: Aumentar stock en origen
                $compraDetalleOrigen = CompraDetalle::where('compra_id', '!=', $compra->id)
                    ->where('producto_id', $ventaDetalle->producto_id)
                    ->where('farmacia_tipo', $venta->farmacia_tipo)
                    ->where('lote', $ventaDetalle->lote)
                    ->first();

                if ($compraDetalleOrigen) {
                    $compraDetalleOrigen->update([
                        'cantidad' => $compraDetalleOrigen->cantidad + $ventaDetalle->cantidad,
                        'cantidad_venta' => ($compraDetalleOrigen->cantidad_venta ?? 0) + $ventaDetalle->cantidad
                    ]);
                }

                // Actualizar producto origen
                $productoOrigen = Producto::where('nombre', $ventaDetalle->producto->nombre ?? '')
                    ->where('farmacia_tipo', $venta->farmacia_tipo)
                    ->first();
                
                if ($productoOrigen) {
                    $productoOrigen->update([
                        'stock' => $productoOrigen->stock + $ventaDetalle->cantidad
                    ]);
                }

                // Revertir: Disminuir stock en destino
                $compraDetalleDestino = CompraDetalle::where('compra_id', $compra->id)
                    ->where('lote', $ventaDetalle->lote)
                    ->first();

                if ($compraDetalleDestino) {
                    $compraDetalleDestino->update([
                        'cantidad' => $compraDetalleDestino->cantidad - $ventaDetalle->cantidad,
                        'cantidad_venta' => max(0, ($compraDetalleDestino->cantidad_venta ?? 0) - $ventaDetalle->cantidad)
                    ]);
                    
                    // Si la cantidad llega a 0, eliminar el registro
                    if ($compraDetalleDestino->cantidad <= 0) {
                        $compraDetalleDestino->delete();
                    }
                }

                // Actualizar producto destino
                $productoDestino = Producto::where('nombre', $ventaDetalle->producto->nombre ?? '')
                    ->where('farmacia_tipo', $compra->farmacia_tipo)
                    ->first();
                
                if ($productoDestino) {
                    $productoDestino->update([
                        'stock' => $productoDestino->stock - $ventaDetalle->cantidad
                    ]);
                }
            }

            // Marcar como anulado (soft delete o cambiar estado)
            $venta->update(['estado' => 'Anulado']);
            $compra->update(['estado' => 'Anulado']);

            DB::commit();

            return response()->json([
                'message' => 'Traspaso anulado exitosamente'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 400);
        }
    }
}
