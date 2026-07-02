<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\CompraDetalle;
use App\Models\Producto;
use App\Models\Proveedor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompraController extends Controller{
    private function resolveFarmaciaTipo(Request $request): string
    {
        $tipo = trim((string) $request->input('farmacia_tipo', 'Farmacia'));

        return $tipo !== '' ? $tipo : 'Farmacia';
    }

    public function cambiarLoteFecha(Request $request, Compra $compra)
    {
        DB::beginTransaction();
        try {
            foreach ($request->compra_detalles as $detalle) {
                CompraDetalle::where('id', $detalle['id'])
                    ->where('compra_id', $compra->id)
                    ->update([
                        'lote' => $detalle['lote'],
                        'fecha_vencimiento' => $detalle['fecha_vencimiento'],
                    ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Lote y fecha de vencimiento actualizados correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al actualizar lote y fecha',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cambiarPrecio(Request $request, Compra $compra)
    {
        DB::beginTransaction();
        try {
            foreach ($request->compra_detalles as $detalle) {
                $precio = (float) $detalle['precio'];
                if ($precio < 0) {
                    throw new \RuntimeException('El precio de compra no puede ser negativo.');
                }

                $cd = CompraDetalle::where('id', $detalle['id'])
                    ->where('compra_id', $compra->id)
                    ->first();

                if (! $cd) {
                    continue;
                }

                $cd->update([
                    'precio' => $precio,
                    'total' => $precio * $cd->cantidad,
                    'precio13' => $precio * 1.3,
                    'total13' => $precio * $cd->cantidad * 1.3,
                ]);
            }

            $compra->total = $compra->compraDetalles()->where('estado', 'Activo')->sum('total');
            $compra->save();

            DB::commit();

            return response()->json([
                'message' => 'Precio de compra actualizado correctamente',
                'compra' => Compra::with(['user', 'proveedor', 'compraDetalles.producto'])->find($compra->id),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al actualizar el precio de compra',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    function historialCompras($id){
        $farmaciaTipo = $this->resolveFarmaciaTipo(request());

        $historial = CompraDetalle::with(['compra.user', 'compra.proveedor', 'producto'])
            ->where('producto_id', $id)
            ->where('farmacia_tipo', $farmaciaTipo)
            ->where('estado', 'Activo')
            ->whereHas('compra', function ($q) {
                $q->where('estado', 'Activo');
            })
            ->orderByDesc('fecha_vencimiento')
            ->get();

        return response()->json($historial);
    }

    function historialVentas($id){
        $farmaciaTipo = $this->resolveFarmaciaTipo(request());

        $detalles = \App\Models\VentaDetalle::with(['venta.user', 'compraDetalle'])
            ->where('producto_id', $id)
            ->where('farmacia_tipo', $farmaciaTipo)
            ->whereHas('venta', function ($q) {
                $q->where('estado', '!=', 'Anulado')->whereNull('deleted_at');
            })
            ->orderByDesc('created_at')
            ->get();

        $ventaIds = $detalles->pluck('venta_id')->unique()->filter()->values();
        $pacientesPorVenta = \DB::table('paciente_ventas')
            ->join('pacientes', 'pacientes.id', '=', 'paciente_ventas.paciente_id')
            ->whereIn('paciente_ventas.venta_id', $ventaIds)
            ->whereNull('paciente_ventas.deleted_at')
            ->select('paciente_ventas.venta_id', \DB::raw("TRIM(CONCAT(COALESCE(pacientes.nombre,''),' ',COALESCE(pacientes.apellido,''))) as nombre_completo"))
            ->get()
            ->keyBy('venta_id');

        $ventas = $detalles->map(function ($d) use ($pacientesPorVenta) {
            $pv = $pacientesPorVenta->get($d->venta_id);
            return [
                'id'          => $d->id,
                'venta_id'    => $d->venta_id,
                'fecha'       => $d->venta?->fecha,
                'hora'        => $d->venta?->hora,
                'cantidad'    => (float) $d->cantidad,
                'precio'      => (float) $d->precio,
                'subtotal'    => round((float) $d->cantidad * (float) $d->precio, 2),
                'tipo_venta'  => $d->venta?->tipo_venta,
                'tipo_pago'   => $d->venta?->tipo_pago,
                'usuario'     => $d->venta?->user?->name,
                'paciente'    => $pv?->nombre_completo,
                'lote'        => $d->compraDetalle?->lote ?? null,
            ];
        });

        $resumen = [
            'total_unidades' => $ventas->sum('cantidad'),
            'total_monto'    => round($ventas->sum('subtotal'), 2),
            'total_ventas'   => $ventas->count(),
        ];

        return response()->json(['ventas' => $ventas, 'resumen' => $resumen]);
    }

    public function productosPorVencer(Request $request){
        $farmaciaTipo = $this->resolveFarmaciaTipo($request);
        $dias = (int) ($request->dias ?? 5);

        $hoy = Carbon::now();
        $limite = $hoy->copy()->addDays($dias);

        $productos = CompraDetalle::with('producto')
            ->where('farmacia_tipo', $farmaciaTipo)
            ->whereNotNull('fecha_vencimiento')
            ->whereBetween('fecha_vencimiento', [$hoy->format('Y-m-d'), $limite->format('Y-m-d')])
            ->orderBy('fecha_vencimiento')
            ->where('cantidad_venta', '>', 0)
            ->where('estado', 'Activo')
            ->get();

        return response()->json($productos);
    }

    public function productosVencidos(Request $request)
    {
        $hoy = Carbon::now()->format('Y-m-d');
        $perPage = $request->per_page ?? 10;
        $farmaciaTipo = $this->resolveFarmaciaTipo($request);

        $productos = CompraDetalle::with(['producto', 'compra.user', 'compra.proveedor'])
            ->where('farmacia_tipo', $farmaciaTipo)
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<', $hoy)
            ->orderBy('fecha_vencimiento', 'desc')
            ->where('cantidad_venta', '>', 0)
            ->where('estado', 'Activo')
            ->paginate($perPage);

        return response()->json($productos);
    }

    public function index(Request $request){
        $farmaciaTipo = $this->resolveFarmaciaTipo($request);

        $query = Compra::with(['user', 'proveedor', 'compraDetalles.producto'])
            ->where('farmacia_tipo', $farmaciaTipo)
            ->orderBy('id', 'desc');

        if ($request->fechaInicio && $request->fechaFin) {
            $query->whereBetween('fecha', [$request->fechaInicio, $request->fechaFin]);
        }

        if ($request->user) {
            $query->where('user_id', $request->user);
        }

        return $query->orderByDesc('fecha')->get();
    }

    public function anular($id)
    {
        DB::beginTransaction();
        try {
            $compra = Compra::with('compraDetalles')->findOrFail($id);

            if ($compra->estado === 'Anulado') {
                return response()->json(['message' => 'La compra ya fue anulada'], 400);
            }

            foreach ($compra->compraDetalles as $detalle) {
                Producto::where('id', $detalle->producto_id)->decrement('stock', $detalle->cantidad);
                $detalle->estado = 'Anulado';
                $detalle->save();
            }

            $compra->estado = 'Anulado';
            $compra->save();

            DB::commit();
            return response()->json(['message' => 'Compra anulada correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al anular la compra', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $fecha = Carbon::now()->format('Y-m-d');
            $hora = Carbon::now()->format('H:i:s');
            $farmaciaTipo = $this->resolveFarmaciaTipo($request);

            $proveedor = Proveedor::find($request->proveedor_id);
            $compra = Compra::create([
                'user_id' => auth()->id(),
                'proveedor_id' => $request->proveedor_id ?? null,
                'farmacia_tipo' => $farmaciaTipo,
                'fecha' => $fecha,
                'hora' => $hora,
                'ci' => $proveedor->ci ?? null,
                'nombre' => $proveedor->nombre ?? null,
                'estado' => 'Activo',
                'tipo_pago' => $request->tipo_pago,
                'total' => collect($request->productos)->sum(fn($p) => $p['precio'] * $p['cantidad']),
                'comentario' => $request->comentario,
                'nro_factura' => $request->nro_factura ?? null,
            ]);

            foreach ($request->productos as $p) {
                CompraDetalle::create([
                    'compra_id' => $compra->id,
                    'user_id' => auth()->id(),
                    'producto_id' => $p['producto_id'],
                    'farmacia_tipo' => $farmaciaTipo,
                    'proveedor_id' => $compra->proveedor_id,
                    'nombre' => $p['producto']['nombre'],
                    'precio' => $p['precio'],
                    'cantidad' => $p['cantidad'],
                    'cantidad_venta' => $p['cantidad'],
                    'factor' => $p['factor'],
                    'total' => $p['precio'] * $p['cantidad'],
                    'precio13' => $p['precio'] * 1.3,
                    'total13' => $p['precio'] * $p['cantidad'] * 1.3,
                    'precio_venta' => $p['precio_venta'],
                    'estado' => 'Activo',
                    'lote' => $p['lote'],
                    'fecha_vencimiento' => $p['fecha_vencimiento'],
                    'nro_factura' => $compra->nro_factura,
                ]);

                $producto = Producto::where('id', $p['producto_id'])
                    ->where('farmacia_tipo', $farmaciaTipo)
                    ->first();

                if (!$producto) {
                    throw new \RuntimeException('Producto no encontrado para la farmacia seleccionada.');
                }

                $producto->precio = $p['precio_venta'];
                $producto->precio_compra = $p['precio'];
                $producto->save();
            }

            DB::commit();
            $compraSearch = Compra::with(['user', 'proveedor', 'compraDetalles.producto'])->find($compra->id);
            return $compraSearch;
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al registrar la compra', 'error' => $e->getMessage()], 500);
        }
    }
}
