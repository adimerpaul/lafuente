<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\CompraDetalle;
use App\Models\Producto;
use App\Models\Receta;
use App\Models\Venta;
use App\Models\VentaDetalle;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
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
        DB::beginTransaction();
        try {
            // 1) Cliente
            $cliente = $this->clienteUpdateOrCreate($request);

            $fecha = $request->input('fecha') ?? date('Y-m-d');
            // 2) Venta cabecera
            $request->merge([
                'user_id'    => auth()->id(),
                'cliente_id' => $cliente->id,
                'fecha'      => $fecha,
                'hora'       => date('H:i:s'),
                'estado'     => 'Activo',
                'tipo_comprobante' => 'Venta',
            ]);
            /** @var Venta $venta */
            $venta = Venta::create($request->only([
                'user_id','cliente_id','fecha','hora','ci','nombre','estado',
                'tipo_comprobante','total','tipo_venta','tipo_pago','pagado_interno','doctor_id'
            ]));

            // 3) Detalles con LOTES (usa compra_detalles.cantidad_venta como "disponible")
            $productos = (array)$request->input('productos', []);
            $total = 0.0;

            foreach ($productos as $item) {
                $productoId = (int)($item['producto_id'] ?? 0);
                $cantidad   = (float)($item['cantidad'] ?? 0);
                $precio     = (float)($item['precio'] ?? 0);
                if ($productoId <= 0 || $cantidad <= 0) {
                    abort(422, 'Producto o cantidad inválida.');
                }

                $producto = Producto::select('id','nombre')->findOrFail($productoId);
                $nombreProducto = $producto->nombre;

                // Si vino un lote concreto, usarlo
                if (!empty($item['compra_detalle_id'])) {
                    $loteId = (int)$item['compra_detalle_id'];

                    $cd = CompraDetalle::where('id', $loteId)
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
        $venta->tipo_venta = $venta->tipo_venta === 'Interno' ? 'Externo' : 'Interno';
        $venta->save();
        return $venta;
    }

    public function index(Request $request)
    {
        $fechaInicio = $request->input('fechaInicio');
        $fechaFin    = $request->input('fechaFin');
        $user        = $request->input('user');

        $q = Venta::with('user', 'cliente')
            ->when($fechaInicio && $fechaFin, fn($qq)=>$qq->whereBetween('fecha', [$fechaInicio, $fechaFin]))
            ->orderBy('created_at', 'desc');

        if ($user) $q->where('user_id', $user);

        return $q->get();
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
