<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Compra;
use App\Models\CompraDetalle;
use App\Models\Producto;
use App\Models\Receta;
use App\Models\User;
use App\Models\Venta;
use App\Models\VentaDetalle;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class VentaController extends Controller
{
    private function canAgregarProducto(?User $user): bool
    {
        return $user?->can('Ventas agregar producto') ?? false;
    }

    private function resolveFarmaciaTipo(Request $request): string
    {
        $tipo = trim((string) $request->input('farmacia_tipo', 'Farmacia'));

        return $tipo !== '' ? $tipo : 'Farmacia';
    }

    private function ventasIndexQuery(Request $request)
    {
        $fechaInicio = $request->input('fechaInicio');
        $fechaFin    = $request->input('fechaFin');
        $user        = $request->input('user');
        $tipoVenta   = $request->input('tipoVenta', $request->input('tipo_venta'));
        $facturado   = $request->input('facturado');
        $farmaciaTipo = $this->resolveFarmaciaTipo($request);

        $q = Venta::with('user', 'cliente', 'ventaDetalles.producto', 'doctor')
            ->where('farmacia_tipo', $farmaciaTipo)
            ->when($fechaInicio && $fechaFin, fn($qq) => $qq->whereBetween('fecha', [$fechaInicio, $fechaFin]))
            ->when($user, fn($qq) => $qq->where('user_id', $user))
            ->when($tipoVenta, fn($qq) => $qq->where('tipo_venta', $tipoVenta))
            ->when($facturado !== null && $facturado !== '', fn($qq) => $qq->where('facturado', filter_var($facturado, FILTER_VALIDATE_BOOLEAN)))
            ->orderBy('created_at', 'desc');

        return $q;
    }

    //    this.$axios.put(`ventasCambiarTipoPago/${venta.id}`, { tipo_pago: tipoPago }).then(res => {
//Route::put('/ventasCambiarTipoPago/{venta}', [App\Http\Controllers\VentaController::class, 'cambiarTipoPago']);
    function cambiarTipoPago(Request $request, $id)
    {
        $venta = Venta::findOrFail($id);
        $tipoPago = $venta->tipo_pago;
        if ($tipoPago == 'Efectivo'){
            $tipoPago = 'QR';
        } else{
            $tipoPago = 'Efectivo';
        }
        $venta->tipo_pago = $tipoPago;
        $venta->save();
        return $venta;
    }
    public function actualizarFacturacion(Request $request, $id)
    {
        $venta = Venta::findOrFail($id);
        $facturado = filter_var($request->input('facturado', false), FILTER_VALIDATE_BOOLEAN);
        $numeroFactura = trim((string)$request->input('numero_factura', ''));

        if ($facturado && $numeroFactura === '') {
            return response()->json(['message' => 'Debe ingresar el número de factura cuando la venta está facturada.'], 422);
        }

        $venta->facturado = $facturado;
        $venta->numero_factura = $facturado ? $numeroFactura : null;
        $venta->save();

        return Venta::with('user', 'cliente', 'ventaDetalles.producto', 'doctor')->findOrFail($venta->id);
    }
    public function agregarProducto(Request $request, $id)
    {
        if (!$this->canAgregarProducto($request->user())) {
            return response()->json(['message' => 'No tiene permiso para agregar productos a una venta.'], 403);
        }

        DB::beginTransaction();
        try {
            $venta = Venta::where('id', $id)->lockForUpdate()->firstOrFail();
            if ($venta->estado !== 'Activo') {
                abort(422, 'Solo se pueden agregar productos a ventas activas.');
            }

            $farmaciaTipo = $this->resolveFarmaciaTipo($request);
            if ($venta->farmacia_tipo !== $farmaciaTipo) {
                abort(422, 'La venta no corresponde a la farmacia seleccionada.');
            }

            $productoId = (int) $request->input('producto_id', 0);
            $compraDetalleId = (int) $request->input('compra_detalle_id', 0);
            $cantidad = (float) $request->input('cantidad', 0);
            $precio = (float) $request->input('precio', 0);

            if ($productoId <= 0 || $compraDetalleId <= 0 || $cantidad <= 0 || $precio < 0) {
                abort(422, 'Datos inválidos para agregar el producto.');
            }

            $producto = Producto::select('id', 'nombre')
                ->where('farmacia_tipo', $farmaciaTipo)
                ->findOrFail($productoId);

            $compraDetalle = CompraDetalle::where('id', $compraDetalleId)
                ->where('farmacia_tipo', $farmaciaTipo)
                ->lockForUpdate()
                ->firstOrFail();

            if ((int) $compraDetalle->producto_id !== $productoId) {
                abort(422, 'El lote seleccionado no corresponde al producto.');
            }
            if ($compraDetalle->estado !== 'Activo') {
                abort(422, 'El lote seleccionado no está activo.');
            }
            if ((float) $compraDetalle->cantidad_venta < $cantidad) {
                abort(422, "Stock insuficiente en el lote {$compraDetalle->lote}.");
            }

            VentaDetalle::create([
                'venta_id' => $venta->id,
                'producto_id' => $productoId,
                'farmacia_tipo' => $farmaciaTipo,
                'compra_detalle_id' => $compraDetalle->id,
                'nombre' => $producto->nombre,
                'cantidad' => $cantidad,
                'precio' => $precio,
                'lote' => $compraDetalle->lote,
                'fecha_vencimiento' => $compraDetalle->fecha_vencimiento,
            ]);

            $compraDetalle->cantidad_venta = (float) $compraDetalle->cantidad_venta - $cantidad;
            $compraDetalle->save();

            $venta->total = (float) $venta->total + ($cantidad * $precio);
            $venta->save();

            DB::commit();

            return Venta::with('user', 'cliente', 'ventaDetalles.producto', 'doctor')->findOrFail($venta->id);
        } catch (\Throwable $e) {
            DB::rollBack();
            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                throw $e;
            }

            return response()->json(['message' => 'No se pudo agregar el producto: ' . $e->getMessage()], 500);
        }
    }
    public function aumentarProducto(Request $request, $id)
    {
        if (!$this->canAgregarProducto($request->user())) {
            return response()->json(['message' => 'No tiene permiso para aumentar productos en una venta.'], 403);
        }

        DB::beginTransaction();
        try {
            $venta = Venta::where('id', $id)->lockForUpdate()->firstOrFail();
            if ($venta->estado !== 'Activo') {
                abort(422, 'Solo se pueden aumentar productos en ventas activas.');
            }

            $farmaciaTipo = $this->resolveFarmaciaTipo($request);
            if ($venta->farmacia_tipo !== $farmaciaTipo) {
                abort(422, 'La venta no corresponde a la farmacia seleccionada.');
            }

            $ventaDetalleId = (int) $request->input('venta_detalle_id', 0);
            $cantidad = (float) $request->input('cantidad', 0);
            if ($ventaDetalleId <= 0 || $cantidad <= 0) {
                abort(422, 'Datos inválidos para aumentar el producto.');
            }

            $detalle = VentaDetalle::where('id', $ventaDetalleId)
                ->where('venta_id', $venta->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (!$detalle->compra_detalle_id) {
                abort(422, 'El detalle de venta no tiene lote asociado.');
            }

            $compraDetalle = CompraDetalle::where('id', $detalle->compra_detalle_id)
                ->where('farmacia_tipo', $farmaciaTipo)
                ->lockForUpdate()
                ->firstOrFail();

            if ($compraDetalle->estado !== 'Activo') {
                abort(422, 'El lote asociado no está activo.');
            }
            if ((float) $compraDetalle->cantidad_venta < $cantidad) {
                abort(422, "Stock insuficiente en el lote {$compraDetalle->lote}.");
            }

            $detalle->cantidad = (float) $detalle->cantidad + $cantidad;
            $detalle->save();

            $compraDetalle->cantidad_venta = (float) $compraDetalle->cantidad_venta - $cantidad;
            $compraDetalle->save();

            $venta->total = (float) $venta->total + ($cantidad * (float) $detalle->precio);
            $venta->save();

            DB::commit();

            return Venta::with('user', 'cliente', 'ventaDetalles.producto', 'doctor')->findOrFail($venta->id);
        } catch (\Throwable $e) {
            DB::rollBack();
            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                throw $e;
            }

            return response()->json(['message' => 'No se pudo aumentar el producto: ' . $e->getMessage()], 500);
        }
    }
    function ventasDevolverProducto(Request $request){
//        venta_id: ventaId,
//          venta_detalle_id: venta_detalle_id,
//          cantidad: cantidadNum
        DB::beginTransaction();
        try {
            $ventaId = (int)$request->input('venta_id', 0);
            $ventaDetalleId = (int)$request->input('venta_detalle_id', 0);
            $cantidad = (float)$request->input('cantidad', 0);

            /** @var VentaDetalle $vd */
            $vd = VentaDetalle::where('id', $ventaDetalleId)
                ->where('venta_id', $ventaId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($cantidad <= 0 || $cantidad > (float)$vd->cantidad) {
                abort(422, 'Cantidad inválida para la devolución.');
            }

            // Restaurar stock en el lote
            if ($vd->compra_detalle_id) {
                $cd = CompraDetalle::where('id', $vd->compra_detalle_id)
                    ->lockForUpdate()
                    ->first();
                if ($cd) {
                    $cd->cantidad_venta = (float)$cd->cantidad_venta + $cantidad;
                    $cd->save();
                }
            }

            // Actualizar detalle de venta
            $vd->cantidad = (float)$vd->cantidad - $cantidad;
            if ($vd->cantidad <= 1e-9) {
                $vd->delete();
            } else {
                $vd->save();
            }

            // Actualizar total de venta
            $venta = Venta::where('id', $ventaId)->lockForUpdate()->firstOrFail();
            $venta->total = (float)$venta->total - ($cantidad * (float)$vd->precio);
            $venta->save();

            DB::commit();
            return response()->json(['message' => 'Devolución procesada correctamente.'], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'No se pudo procesar la devolución: ' . $e->getMessage()], 500);
        }
    }
    public function proformaPacientePdf(\App\Models\Paciente $paciente)
    {
        // Trae las ventas vinculadas (paciente_ventas) con la venta y sus detalles
        $paciente->load([
            'pacienteVentas' => function ($q) {
                $q->orderBy('fecha', 'asc');
            },
            'pacienteVentas.venta' => function ($q) {
                $q->with(['ventaDetalles.producto', 'doctor']);
            },
            'pacienteVentas.user'
        ]);

        // Total general
        $totalGeneral = 0;
        foreach ($paciente->pacienteVentas as $pv) {
            $venta = $pv->venta;
            if (!$venta) continue;
            // si no viene total, sumar por si acaso
            if ($venta->total === null) {
                $subtotal = 0;
                foreach ($venta->ventaDetalles as $d) {
                    $subtotal += floatval($d->cantidad) * floatval($d->precio);
                }
                $venta->total = $subtotal;
            }
            $totalGeneral += floatval($venta->total);
        }

        $hoy = now();

        $pdf = Pdf::loadView('pdf.proforma_paciente', [
            'paciente'     => $paciente,
            'pacienteVentas' => $paciente->pacienteVentas,
            'totalGeneral' => $totalGeneral,
            'hoy'          => $hoy,
        ])->setPaper('letter'); // tamaño carta; usa 'a4' si prefieres

        return $pdf->stream('proforma_paciente_'.$paciente->id.'.pdf');
        // ->download('proforma_paciente_'.$paciente->id.'.pdf');
    }
    public function ventasPdf(Request $request)
    {
        $ventas = $this->ventasIndexQuery($request)
            ->where('estado', 'Activo')
            ->get();

        $totalGeneral = $ventas->sum(fn($venta) => floatval($venta->total ?? 0));
        $totalInternado = $ventas
            ->where('tipo_venta', 'Internado')
            ->sum(fn($venta) => floatval($venta->total ?? 0));
        $totalExterno = $ventas
            ->where('tipo_venta', 'Externo')
            ->sum(fn($venta) => floatval($venta->total ?? 0));
        $totalSeguro = $ventas
            ->where('tipo_venta', 'Seguro')
            ->sum(fn($venta) => floatval($venta->total ?? 0));
        $totalQrInternado = $ventas
            ->filter(fn($venta) => strtoupper((string) $venta->tipo_pago) === 'QR' && $venta->tipo_venta === 'Internado')
            ->sum(fn($venta) => floatval($venta->total ?? 0));
        $totalQrExterno = $ventas
            ->filter(fn($venta) => strtoupper((string) $venta->tipo_pago) === 'QR' && $venta->tipo_venta === 'Externo')
            ->sum(fn($venta) => floatval($venta->total ?? 0));
        $totalQrSeguro = $ventas
            ->filter(fn($venta) => strtoupper((string) $venta->tipo_pago) === 'QR' && $venta->tipo_venta === 'Seguro')
            ->sum(fn($venta) => floatval($venta->total ?? 0));
        $totalEfectivoInternado = $ventas
            ->filter(fn($venta) => strtoupper((string) $venta->tipo_pago) === 'EFECTIVO' && $venta->tipo_venta === 'Internado')
            ->sum(fn($venta) => floatval($venta->total ?? 0));
        $totalEfectivoExterno = $ventas
            ->filter(fn($venta) => strtoupper((string) $venta->tipo_pago) === 'EFECTIVO' && $venta->tipo_venta === 'Externo')
            ->sum(fn($venta) => floatval($venta->total ?? 0));
        $totalEfectivoSeguro = $ventas
            ->filter(fn($venta) => strtoupper((string) $venta->tipo_pago) === 'EFECTIVO' && $venta->tipo_venta === 'Seguro')
            ->sum(fn($venta) => floatval($venta->total ?? 0));

        $hoy = now();
        $tipoVenta = $request->input('tipoVenta');
        $facturado = $request->input('facturado');
        $userId = $request->input('user');
        $userLabel = $userId ? optional(User::find($userId))->name : 'Todos';
        $titulo = match ($tipoVenta) {
            'Internado' => 'REPORTE DE VENTAS INTERNAS',
            'Externo' => 'REPORTE DE VENTAS EXTERNAS',
            'Seguro' => 'REPORTE DE VENTAS SEGURO',
            default => 'REPORTE GENERAL DE VENTAS',
        };
        if ($facturado !== null && $facturado !== '') {
            $titulo .= filter_var($facturado, FILTER_VALIDATE_BOOLEAN) ? ' - FACTURADAS' : ' - NO FACTURADAS';
        }

        $pdf = Pdf::loadView('pdf.ventas_reporte', [
            'ventas' => $ventas,
            'totalGeneral' => $totalGeneral,
            'totalInternado' => $totalInternado,
            'totalExterno' => $totalExterno,
            'totalSeguro' => $totalSeguro,
            'totalQrInternado' => $totalQrInternado,
            'totalQrExterno' => $totalQrExterno,
            'totalQrSeguro' => $totalQrSeguro,
            'totalEfectivoInternado' => $totalEfectivoInternado,
            'totalEfectivoExterno' => $totalEfectivoExterno,
            'totalEfectivoSeguro' => $totalEfectivoSeguro,
            'fechaInicio' => $request->input('fechaInicio'),
            'fechaFin' => $request->input('fechaFin'),
            'userId' => $userId,
            'userLabel' => $userLabel,
            'tipoVenta' => $tipoVenta,
            'titulo' => $titulo,
            'hoy' => $hoy,
        ])->setPaper('letter');

        return $pdf->stream('ventas_reporte.pdf');
    }

    public function reporteFarmaciaPdf(Request $request)
    {
        $ventas = $this->ventasIndexQuery($request)
            ->where('estado', 'Activo')
            ->with(['ventaDetalles.compraDetalle'])
            ->get();

        $internado = $ventas->where('tipo_venta', 'Internado')->sum(fn($v) => (float)($v->total ?? 0));
        $interno = $ventas->where('tipo_venta', 'Interno')->sum(fn($v) => (float)($v->total ?? 0));
        $externo = $ventas->where('tipo_venta', 'Externo')->sum(fn($v) => (float)($v->total ?? 0));
        $seguro = $ventas->where('tipo_venta', 'Seguro')->sum(fn($v) => (float)($v->total ?? 0));
        $egreso = $ventas->where('tipo_venta', 'Egreso')->sum(fn($v) => (float)($v->total ?? 0));

        $ingresos = $internado + $interno + $externo + $seguro;
        $fechaInicio = $request->input('fechaInicio');
        $fechaFin = $request->input('fechaFin');
        $farmaciaTipo = $this->resolveFarmaciaTipo($request);

        $comprasQuery = Compra::query()
            ->where('estado', 'Activo')
            ->where('farmacia_tipo', $farmaciaTipo);
        if ($fechaInicio && $fechaFin) {
            $comprasQuery->whereBetween('fecha', [$fechaInicio, $fechaFin]);
        }
        $comprasFarmacia = (float)$comprasQuery->sum('total');

        $gastos = $egreso + $comprasFarmacia;
        $saldoFavor = $ingresos - $gastos;

        $costoSegunIngreso = 0.0;
        foreach ($ventas as $venta) {
            if ($venta->tipo_venta === 'Egreso') continue;
            foreach (($venta->ventaDetalles ?? []) as $detalle) {
                $cantidad = (float)($detalle->cantidad ?? 0);
                $costoUnitario = (float)optional($detalle->compraDetalle)->precio;
                $costoSegunIngreso += $cantidad * $costoUnitario;
            }
        }

        $utilidadFarmacia = $ingresos - $costoSegunIngreso;
        $hoy = now();
        $titulo = 'REPORTE DE FARMACIA';

        $pdf = Pdf::loadView('pdf.farmacia_reporte', [
            'titulo' => $titulo,
            'hoy' => $hoy,
            'fechaInicio' => $fechaInicio,
            'fechaFin' => $fechaFin,
            'farmaciaTipo' => $farmaciaTipo,
            'internado' => $internado,
            'interno' => $interno,
            'externo' => $externo,
            'seguro' => $seguro,
            'egreso' => $egreso,
            'ingresos' => $ingresos,
            'comprasFarmacia' => $comprasFarmacia,
            'gastos' => $gastos,
            'saldoFavor' => $saldoFavor,
            'costoSegunIngreso' => $costoSegunIngreso,
            'utilidadFarmacia' => $utilidadFarmacia,
            'totalVentas' => $ingresos,
        ])->setPaper('letter');

        return $pdf->stream('reporte_farmacia.pdf');
    }
    public function searchCliente(Request $request)
    {
        $nit = trim((string)$request->input('nit', ''));
        if ($nit === '') return response()->json([]);

        $c = Cliente::where('ci', $nit)->first();
        if (!$c) return response()->json([]);
        return response()->json([
            'nombre' => $c->nombre,
            'email' => $c->email ?? null,
            'codigoTipoDocumentoIdentidad' => 1,
            'complemento' => $c->complemento ?? null,
        ]);
    }

    public function store(Request $request)
    {
        if ($request->boolean('facturado') && trim((string)$request->input('numero_factura', '')) === '') {
            return response()->json(['message' => 'Debe ingresar el número de factura cuando la venta está facturada.'], 422);
        }

        DB::beginTransaction();
        try {
            // 1) Cliente
            $cliente = $this->clienteUpdateOrCreate($request);
            $farmaciaTipo = $this->resolveFarmaciaTipo($request);

            $fecha = $request->input('fecha') ?? date('Y-m-d');
            // 2) Venta cabecera
            $request->merge([
                'user_id'    => auth()->id(),
                'cliente_id' => $cliente->id,
                'farmacia_tipo' => $farmaciaTipo,
                'fecha'      => $fecha,
                'hora'       => date('H:i:s'),
                'estado'     => 'Activo',
                'tipo_comprobante' => 'Venta',
                'tipo_venta' => match ($request->input('tipo_venta')) {
                    'Interno', 'Internado' => 'Internado',
                    'Seguro' => 'Seguro',
                    'Egreso' => 'Egreso',
                    'Recepción', 'Recepcion' => 'Recepción',
                    default => 'Externo',
                },
                'facturado' => filter_var($request->input('facturado', false), FILTER_VALIDATE_BOOLEAN),
            ]);
            /** @var Venta $venta */
            $venta = Venta::create($request->only([
                'user_id','cliente_id','fecha','hora','ci','nombre','estado',
                'tipo_comprobante','total','comentario','tipo_venta','tipo_pago','facturado','numero_factura','pagado_interno','doctor_id','farmacia_tipo'
            ]));

            // 3) Detalles con LOTES (usa compra_detalles.cantidad_venta como "disponible")
            $productos = (array)$request->input('productos', []);
            $total = 0.0;
            $esEgreso = $venta->tipo_venta === 'Egreso';

            if ($esEgreso) {
                $total = (float)$request->input('total', 0);
                if ($total <= 0) {
                    abort(422, 'El monto del egreso debe ser mayor a 0.');
                }
            } else foreach ($productos as $item) {
                $productoId = (int)($item['producto_id'] ?? 0);
                $cantidad   = (float)($item['cantidad'] ?? 0);
                $precio     = (float)($item['precio'] ?? 0);
                if ($productoId <= 0 || $cantidad <= 0) {
                    abort(422, 'Producto o cantidad inválida.');
                }

                $producto = Producto::select('id','nombre')
                    ->where('farmacia_tipo', $farmaciaTipo)
                    ->findOrFail($productoId);
                $nombreProducto = $producto->nombre;

                // Si vino un lote concreto, usarlo
                if (!empty($item['compra_detalle_id'])) {
                    $loteId = (int)$item['compra_detalle_id'];

                    $cd = CompraDetalle::where('id', $loteId)
                        ->where('farmacia_tipo', $farmaciaTipo)
                        ->lockForUpdate()
                        ->firstOrFail();

                    if ((int)$cd->producto_id !== $productoId) {
                        abort(422, 'El lote seleccionado no corresponde al producto.');
                    }
                    if ($cd->estado !== 'Activo') {
                        abort(422, 'El lote seleccionado no está activo.');
                    }
                    if ((float)$cd->cantidad_venta < $cantidad) {
                        abort(422, "Stock insuficiente para el producto '{$nombreProducto}' en el lote {$cd->lote} (disponible: {$cd->cantidad_venta}, solicitado: {$cantidad}).");
                    }

                    VentaDetalle::create([
                        'venta_id'          => $venta->id,
                        'producto_id'       => $productoId,
                        'farmacia_tipo'     => $farmaciaTipo,
                        'compra_detalle_id' => $cd->id,
                        'nombre'            => $nombreProducto,
                        'cantidad'          => $cantidad,
                        'precio'            => $precio,
                        'lote'              => $cd->lote,
                        'fecha_vencimiento' => $cd->fecha_vencimiento,
                    ]);

                    // Descontar del lote
                    $cd->cantidad_venta = (float)$cd->cantidad_venta - $cantidad;
                    $cd->save();

                    $total += $cantidad * $precio;
                    continue;
                }

                // FIFO por fecha de vencimiento (nulos al final)
                $restante = $cantidad;
                $lotes = CompraDetalle::where('producto_id', $productoId)
                    ->where('farmacia_tipo', $farmaciaTipo)
                    ->where('estado', 'Activo')
                    ->whereNull('deleted_at')
                    ->where('cantidad_venta', '>', 0)
                    ->orderByRaw("CASE WHEN fecha_vencimiento IS NULL THEN 1 ELSE 0 END, fecha_vencimiento ASC")
                    ->lockForUpdate()
                    ->get(['id','cantidad_venta','lote','fecha_vencimiento']);

                foreach ($lotes as $l) {
                    if ($restante <= 0) break;

                    $take = min((float)$l->cantidad_venta, $restante);
                    if ($take <= 0) continue;

                    VentaDetalle::create([
                        'venta_id'          => $venta->id,
                        'producto_id'       => $productoId,
                        'farmacia_tipo'     => $farmaciaTipo,
                        'compra_detalle_id' => $l->id,
                        'nombre'            => $nombreProducto,
                        'cantidad'          => $take,
                        'precio'            => $precio,
                        'lote'              => $l->lote,
                        'fecha_vencimiento' => $l->fecha_vencimiento,
                    ]);

                    $l->cantidad_venta = (float)$l->cantidad_venta - $take;
                    $l->save();

                    $total    += $take * $precio;
                    $restante -= $take;
                }

                if ($restante > 1e-9) {
                    abort(422, 'Stock insuficiente por lotes.');
                }
            }

            // 4) Totales + receta
            $venta->update(['total' => $total]);

            if ($request->filled('receta_id')) {
                $receta = Receta::findOrFail((int)$request->input('receta_id'));
                $receta->numero_factura = $venta->id;
                $receta->save();
            }

            DB::commit();

            // Respuesta con usuario, cliente y detalles + producto
            return Venta::with('user', 'ventaDetalles.producto', 'cliente','doctor')->findOrFail($venta->id);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar la venta: ' . $e->getMessage()], 500);
        }
    }

    public function anular(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            /** @var Venta $venta */
            $venta = Venta::with('ventaDetalles')->lockForUpdate()->findOrFail($id);

            if ($venta->estado === 'Anulada') {
                DB::commit();
                return $venta;
            }

            // Restaurar stock lote x lote
            foreach ($venta->ventaDetalles as $det) {
                if ($det->compra_detalle_id) {
                    $cd = CompraDetalle::where('id', $det->compra_detalle_id)->lockForUpdate()->first();
                    if ($cd) {
                        $cd->cantidad_venta = (float)$cd->cantidad_venta + (float)$det->cantidad;
                        $cd->save();
                    }
                }
            }

            // 3) Desligar de paciente para que NO aparezca en el historial del paciente
            DB::table('paciente_ventas')->where('venta_id', $venta->id)->delete();

            // 4) Marcar como anulada
            $venta->estado = 'Anulada';
            $venta->save();

            DB::commit();
            return $venta;
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'No se pudo anular: ' . $e->getMessage()], 500);
        }
    }

    public function tipoVentasChange(Request $request, $id)
    {
        $venta = Venta::findOrFail($id);
        $venta->tipo_venta = $venta->tipo_venta === 'Internado' ? 'Externo' : 'Internado';
        $venta->save();
        return $venta;
    }

    public function index(Request $request)
    {
        return $this->ventasIndexQuery($request)->get();
    }

    public function show($id)
    {
        return Venta::with('user', 'cliente', 'ventaDetalles.producto')->findOrFail($id);
    }

    private function clienteUpdateOrCreate(Request $request)
    {
        $ci = trim((string)$request->input('ci', '0'));
        $data = $request->only(['ci','nombre','email','complemento','direccion','telefono']);
        $c = Cliente::where('ci', $ci)->first();
        if ($c) {
            $c->update($data);
            return $c;
        }
        return Cliente::create($data + ['ci' => $ci ?: '0', 'nombre' => $data['nombre'] ?? 'SN']);
    }
}
