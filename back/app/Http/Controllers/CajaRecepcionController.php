<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Paciente;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\CajaRecepcion;
use Illuminate\Http\Request;

class CajaRecepcionController extends Controller
{
    private function queryIndex(Request $request)
    {
        $fechaInicio = $request->get('fechaInicio');
        $fechaFin = $request->get('fechaFin');
        $userId = $request->get('user_id');
        $pacienteId = $request->get('paciente_id');
        $cobrosRetrasados = $request->boolean('cobros_retrasados');
        $cobradoPorUserId = $request->get('cobrado_por_user_id');
        $search = trim((string) $request->get('search', ''));

        return CajaRecepcion::with(['user', 'paciente', 'doctor', 'cobradoPor'])
            ->when($fechaInicio, fn ($q) => $q->whereDate('fecha', '>=', $fechaInicio))
            ->when($fechaFin, fn ($q) => $q->whereDate('fecha', '<=', $fechaFin))
            ->when($userId, fn ($q) => $q->where('user_id', $userId))
            ->when($pacienteId, fn ($q) => $q->where('paciente_id', $pacienteId))
            ->when($cobrosRetrasados, fn ($q) => $q->where('estado_cobro', 'Pendiente'))
            ->when($cobradoPorUserId, fn ($q) => $q->where('cobrado_por_user_id', $cobradoPorUserId))
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($subQuery) use ($search) {
                    $subQuery->where('numero_ficha', 'like', "%{$search}%")
                        ->orWhere('nombre_factura', 'like', "%{$search}%")
                        ->orWhere('laboratorio_nombre', 'like', "%{$search}%")
                        ->orWhereHas('paciente', function ($pacienteQuery) use ($search) {
                            $pacienteQuery->where('nombre', 'like', "%{$search}%")
                                ->orWhere('apellido', 'like', "%{$search}%")
                                ->orWhereRaw("TRIM(CONCAT(COALESCE(nombre, ''), ' ', COALESCE(apellido, ''))) like ?", ["%{$search}%"])
                                ->orWhereRaw("TRIM(CONCAT(COALESCE(apellido, ''), ' ', COALESCE(nombre, ''))) like ?", ["%{$search}%"])
                                ->orWhere('identificacion', 'like', "%{$search}%");
                        });
                });
            });
    }

    public function index(Request $request)
    {
        $items       = $this->queryIndex($request)->orderByDesc('fecha')->orderByDesc('id')->get();
        $activeItems = $items->where('estado', '!=', 'Anulado');
        $paidItems   = $activeItems->where('estado_cobro', 'Pagado');

        $resumen = [
            'total_recaudado'     => (float) $paidItems->sum('recaudado_total'),
            'total_ingresos'      => (float) $paidItems->sum('recaudado_total'),
            'total_egresos'       => (float) $paidItems->sum('egreso'),
            'total_qr'            => (float) $paidItems->sum('qr'),
            'total_efectivo'      => (float) $paidItems->sum('efectivo'),
            'total_efectivo_caja' => (float) $paidItems->sum('efectivo')
                                   - (float) $paidItems->sum('egreso'),
            'total_farmacia'      => (float) $paidItems->sum('costo_farmacia'),
            'total_final'         => (float) $paidItems->sum('efectivo')
                                   - (float) $paidItems->sum('egreso'),
            'total_pendiente'     => (float) $activeItems->where('estado_cobro', '!=', 'Pagado')->sum('recaudado_total'),
        ];

        return response()->json([
            'data'    => $items,
            'summary' => $resumen,
        ]);
    }

    public function pdf(Request $request)
    {
        $items       = $this->queryIndex($request)->orderByDesc('fecha')->orderByDesc('id')->get();
        $activeItems = $items->where('estado', '!=', 'Anulado');
        $paidItems   = $activeItems->where('estado_cobro', 'Pagado');

        $summary = [
            'total_recaudado'     => (float) $paidItems->sum('recaudado_total'),
            'total_egresos'       => (float) $paidItems->sum('egreso'),
            'total_farmacia'      => (float) $paidItems->sum('costo_farmacia'),
            'saldo'               => (float) $paidItems->sum('recaudado_total')
                                   - (float) $paidItems->sum('egreso')
                                   - (float) $paidItems->sum('costo_farmacia'),
            'total_qr'            => (float) $paidItems->sum('qr'),
            'total_efectivo'      => (float) $paidItems->sum('efectivo'),
            'saldo_final_efectivo'=> ((float) $paidItems->sum('recaudado_total')
                                   - (float) $paidItems->sum('egreso')
                                   - (float) $paidItems->sum('costo_farmacia'))
                                   - (float) $paidItems->sum('qr'),
            'total_pendiente'     => (float) $activeItems->where('estado_cobro', '!=', 'Pagado')->sum('recaudado_total'),
        ];

        $hoy = now();
        $userId = $request->get('user_id');
        $userLabel = $userId ? optional(User::find($userId))->name : 'Todos';

        $pdf = Pdf::loadView('pdf.caja_recepciones_reporte', [
            'items' => $items,
            'summary' => $summary,
            'fechaInicio' => $request->get('fechaInicio'),
            'fechaFin' => $request->get('fechaFin'),
            'search' => $request->get('search'),
            'userLabel' => $userLabel,
            'hoy' => $hoy,
        ])->setPaper('letter', 'landscape');

        return $pdf->stream('caja_recepciones_reporte.pdf');
    }

    public function pdfCarta(CajaRecepcion $cajaRecepcion)
    {
        $cajaRecepcion->load(['user', 'paciente', 'doctor']);

        $pdf = Pdf::loadView('pdf.caja_recepcion_carta', [
            'item' => $cajaRecepcion,
            'hoy' => now(),
        ])->setPaper('letter');

        return $pdf->stream('caja_recepcion_'.$cajaRecepcion->id.'_carta.pdf');
    }

    public function pdfFormularioControl(CajaRecepcion $cajaRecepcion)
    {
        $cajaRecepcion->load(['user', 'paciente', 'doctor']);
        $detalle = is_array($cajaRecepcion->formulario_detalle) ? $cajaRecepcion->formulario_detalle : [];

        $rows = [
            [
                'left' => ['label' => 'Caja Vaselinada', 'key' => 'caja_vaselina', 'options' => ['P', 'M', 'G']],
                'right' => ['label' => 'Antisépticos', 'key' => 'antisepticos', 'options' => ['SI', 'CANTIDAD', 'NO']],
            ],
            [
                'left' => ['label' => 'Caja de Curación', 'key' => 'caja_curacion', 'options' => ['P', 'M', 'G']],
                'right' => ['label' => 'Apósitos extras', 'key' => 'apositos_extras', 'options' => ['CANTIDAD']],
            ],
            [
                'left' => ['label' => 'Caja de Sutura', 'key' => 'caja_sutura', 'options' => ['P', 'M', 'G']],
                'right' => ['label' => 'Torundas de gasa extras', 'key' => 'torundas_gasa_extras', 'options' => ['CANTIDAD']],
            ],
            [
                'left' => ['label' => 'Caja de Retiro de Útero', 'key' => 'caja_retiro_uterino', 'options' => ['P', 'M', 'G']],
                'right' => ['label' => 'Gasas Extra', 'key' => 'gases_extra', 'options' => ['CANTIDAD']],
            ],
            [
                'left' => ['label' => 'Caja de Retiro de Puntos', 'key' => 'caja_retiro_puntos', 'options' => ['P', 'M', 'G']],
                'right' => ['label' => 'Venda de Quemado', 'key' => 'venda_quemado', 'options' => ['SI', 'NO']],
            ],
            [
                'left' => ['label' => 'Sutura', 'key' => 'sutura', 'options' => ['P', 'M', 'G']],
                'right' => ['label' => 'Curación', 'key' => 'curacion', 'options' => ['P', 'M', 'G']],
            ],
            [
                'left' => ['label' => 'Uso de Tela Adhesiva', 'key' => 'uso_tela_adhesiva', 'options' => ['P', 'M', 'G']],
                'right' => ['label' => 'Suero', 'key' => 'suero', 'options' => ['SI', 'NO']],
            ],
            [
                'left' => ['label' => 'Uso de Micropor', 'key' => 'uso_micropor', 'options' => ['SI', 'CANTIDAD', 'NO']],
                'right' => ['label' => 'Aspiración', 'key' => 'aspiracion', 'options' => ['SI', 'NO']],
            ],
            [
                'left' => ['label' => 'Nebulización', 'key' => 'nebulizacion', 'options' => ['SI', 'NO']],
                'right' => ['label' => 'Sonda', 'key' => 'sonda', 'options' => ['SNG', 'SOG', 'SV']],
            ],
            [
                'left' => ['label' => 'Glicemia', 'key' => 'glicemia', 'options' => ['SI', 'NO']],
                'right' => ['label' => 'Compresas', 'key' => 'compresas', 'options' => ['P', 'M', 'G']],
            ],
            [
                'left' => ['label' => 'Inyectable', 'key' => 'inyectable', 'options' => ['IM', 'EV', 'SC']],
                'right' => ['label' => 'Yeso', 'key' => 'yeso', 'options' => ['SI', 'NO']],
            ],
            [
                'left' => ['label' => 'Guantes (Dediles)', 'key' => 'guantes_dediles', 'options' => ['SI', 'CANTIDAD', 'NO']],
                'right' => ['label' => 'Oxígeno', 'key' => 'oxigeno', 'options' => ['SI', 'NO']],
            ],
            [
                'left' => ['label' => 'Campo Fenestrado', 'key' => 'campo_fenestrado', 'options' => ['SI', 'NO']],
                'right' => ['label' => 'Enema', 'key' => 'enema', 'options' => ['SI', 'NO']],
            ],
            [
                'left' => ['label' => 'Colocado de Stopper', 'key' => 'colocado_stopper', 'options' => ['SI', 'NO']],
                'right' => ['label' => 'Corbatas', 'key' => 'corbatas', 'options' => ['SI', 'NO']],
            ],
            [
                'left' => ['label' => 'Monitor - Desfibrilador', 'key' => 'monitor_desfibrilador', 'options' => ['SI', 'NO']],
                'right' => ['label' => 'Algodón', 'key' => 'algodon', 'options' => ['SI', 'NO']],
            ],
        ];

        $prices = [
            'caja_vaselina' => ['P' => 10, 'M' => 15, 'G' => 20],
            'caja_curacion' => ['P' => 8, 'M' => 12, 'G' => 16],
            'caja_sutura' => ['P' => 18, 'M' => 24, 'G' => 30],
            'caja_retiro_uterino' => ['P' => 10, 'M' => 14, 'G' => 18],
            'caja_retiro_puntos' => ['P' => 10, 'M' => 14, 'G' => 18],
            'sutura' => ['P' => 15, 'M' => 20, 'G' => 25],
            'uso_tela_adhesiva' => ['P' => 5, 'M' => 7, 'G' => 10],
            'uso_micropor' => ['SI' => 6],
            'nebulizacion' => ['SI' => 20],
            'glicemia' => ['SI' => 15],
            'inyectable' => ['IM' => 10, 'EV' => 15, 'SC' => 8],
            'guantes_dediles' => ['SI' => 5],
            'campo_fenestrado' => ['SI' => 10],
            'colocado_stopper' => ['SI' => 8],
            'monitor_desfibrilador' => ['SI' => 25],
            'antisepticos' => ['SI' => 8],
            'apositos_extras' => ['SI' => 7],
            'torundas_gasa_extras' => ['SI' => 7],
            'gases_extra' => ['SI' => 7],
            'venda_quemado' => ['SI' => 15],
            'curacion' => ['P' => 15, 'M' => 20, 'G' => 30],
            'suero' => ['SI' => 25],
            'aspiracion' => ['SI' => 20],
            'sonda' => ['SNG' => 18, 'SOG' => 18, 'SV' => 15],
            'compresas' => ['P' => 10, 'M' => 15, 'G' => 20],
            'yeso' => ['SI' => 35],
            'oxigeno' => ['SI' => 20],
            'enema' => ['SI' => 18],
            'corbatas' => ['SI' => 10],
            'algodon' => ['SI' => 5],
        ];

        $totalReferencial = 0.0;
        foreach ($detalle as $key => $rawValue) {
            $values = is_array($rawValue) ? $rawValue : (($rawValue === null || $rawValue === '') ? [] : [$rawValue]);
            foreach ($values as $selected) {
                $totalReferencial += (float)($prices[$key][$selected] ?? 0);
            }
        }

        $pdf = Pdf::loadView('pdf.caja_recepcion_formulario_control', [
            'item' => $cajaRecepcion,
            'rows' => $rows,
            'detalle' => $detalle,
            'totalReferencial' => $totalReferencial,
            'hoy' => now(),
        ])->setPaper('letter');

        return $pdf->stream('caja_recepcion_'.$cajaRecepcion->id.'_formulario_control.pdf');
    }

    public function show(CajaRecepcion $cajaRecepcion)
    {
        return CajaRecepcion::with(['user', 'paciente', 'doctor', 'cobradoPor'])->findOrFail($cajaRecepcion->id);
    }

    public function store(Request $request)
    {
        $data = $this->validatedData($request);
        $data['user_id'] = $request->user()->id;
        $data['tipo_movimiento'] = 'Ingreso';
        $data['tipo_documento'] = (int) (($data['punto'] ?? 0) === 1);
        $data['estado'] = 'Activo';
        $data['recaudado_total'] = $this->calculateRecaudadoTotal($data);

        $cajaRecepcion = CajaRecepcion::create($data);

        return response()->json($cajaRecepcion->load(['user', 'paciente', 'doctor', 'cobradoPor']), 201);
    }

    public function update(Request $request, CajaRecepcion $cajaRecepcion)
    {
        $data = $this->validatedData($request);
        $data['user_id'] = $request->user()->id;
        $data['tipo_movimiento'] = 'Ingreso';
        $data['tipo_documento'] = (int) (($data['punto'] ?? 0) === 1);
        $data['recaudado_total'] = $this->calculateRecaudadoTotal($data);

        $cajaRecepcion->update($data);

        return response()->json($cajaRecepcion->load(['user', 'paciente', 'doctor', 'cobradoPor']));
    }

    public function anular(CajaRecepcion $cajaRecepcion)
    {
        if ($cajaRecepcion->is_anulado) {
            return response()->json(['message' => 'Este registro ya fue anulado.'], 422);
        }

        $cajaRecepcion->update(['estado' => 'Anulado']);

        return response()->json($cajaRecepcion->load(['user', 'paciente', 'doctor', 'cobradoPor']));
    }

    public function cobrar(Request $request, CajaRecepcion $cajaRecepcion)
    {
        $data = $request->validate([
            'fecha_cobro' => 'required|date',
            'cobrado_por_user_id' => 'required|exists:users,id',
        ]);

        $cajaRecepcion->update([
            'fecha_cobro' => $data['fecha_cobro'],
            'cobrado_por_user_id' => $data['cobrado_por_user_id'],
        ]);

        return response()->json($cajaRecepcion->load(['user', 'paciente', 'doctor', 'cobradoPor']));
    }

    public function destroy(CajaRecepcion $cajaRecepcion)
    {
        $cajaRecepcion->update([
            'estado' => 'Anulado',
        ]);

        return response()->json(null, 204);
    }

    public function liquidacionPacientePdf(Request $request, Paciente $paciente)
    {
        $fechaInicio = $request->get('fechaInicio');
        $fechaFin = $request->get('fechaFin');
        $tipoImpresion = $request->get('tipo_impresion', 'todo');

        $query = CajaRecepcion::with(['doctor', 'cobradoPor'])
            ->where('paciente_id', $paciente->id)
            ->where('estado', '!=', 'Anulado');

        if ($tipoImpresion === 'pagado_luego') {
            $query->whereNotNull('fecha_cobro')
                ->when($fechaInicio, fn ($q) => $q->whereDate('fecha_cobro', '>=', $fechaInicio))
                ->when($fechaFin, fn ($q) => $q->whereDate('fecha_cobro', '<=', $fechaFin));
        } else {
            $query->when($fechaInicio, fn ($q) => $q->whereDate('fecha', '>=', $fechaInicio))
                ->when($fechaFin, fn ($q) => $q->whereDate('fecha', '<=', $fechaFin));

            if ($tipoImpresion === 'paga_ahora') {
                $query->where('estado_cobro', 'Pagado');
            }
        }

        $items = $query->orderBy('fecha')->orderBy('id')->get();

        $rowsClinica = $this->buildRowsFromFields($items, [
            'Atencion medica' => 'costo_atencion_medica',
            'Curacion' => 'costo_curacion',
            'Inyectable' => 'costo_inyectable',
            'Toma de presion' => 'costo_toma_presion',
            'Ambulancia' => 'costo_ambulancia',
            'Uso consultorio' => 'costo_uso_consultorio',
            'Glicemia' => 'costo_glicemia',
            'Certificado medico' => 'costo_certificado_medico',
            'Sutura' => 'costo_sutura',
            'Antisepticos' => 'costo_antisepticos',
            'Cama' => 'costo_cama',
            'Compania noche' => 'costo_compania_noche',
            'Flebotomia' => 'costo_flebotomia',
            'Sonda' => 'costo_sonda',
            'Otros costos' => 'otros_costos',
        ]);

        $totalClinica = collect($rowsClinica)->sum('monto');
        $totalFarmacia = (float) $items->sum(fn ($item) => (float) ($item->costo_farmacia ?? 0));

        $rowsFarmacia = $items
            ->filter(fn ($item) => (float) ($item->costo_farmacia ?? 0) > 0)
            ->map(fn ($item) => [
                'fecha' => (string) ($item->fecha ?? ''),
                'detalle' => trim((string) ($item->nombre_factura ?: $item->numero_ficha ?: 'Consumo farmacia')),
                'monto' => (float) ($item->costo_farmacia ?? 0),
            ])
            ->values()
            ->all();

        $rowsHonorarios = $items
            ->filter(fn ($item) => (float) ($item->egreso ?? 0) > 0)
            ->groupBy(fn ($item) => optional($item->doctor)->nombre ?: 'Sin doctor')
            ->map(fn ($group, $doctor) => [
                'label' => $doctor,
                'monto' => (float) $group->sum(fn ($item) => (float) ($item->egreso ?? 0)),
            ])
            ->values()
            ->all();

        $totalHonorarios = collect($rowsHonorarios)->sum('monto');
        $totalCobrar = $totalClinica + $totalFarmacia + $totalHonorarios;
        $totalPagaAhora = (float) $items
            ->filter(fn ($item) => ($item->estado_cobro ?? 'Pendiente') === 'Pagado')
            ->sum(fn ($item) => (float) ($item->recaudado_total ?? 0));
        $totalPagaLuego = (float) $items
            ->filter(fn ($item) => ($item->estado_cobro ?? 'Pendiente') !== 'Pagado')
            ->sum(fn ($item) => (float) ($item->recaudado_total ?? 0));

        $hoy = now();
        $pdf = Pdf::loadView('pdf.caja_liquidacion_paciente', [
            'paciente' => $paciente,
            'items' => $items,
            'rowsClinica' => $rowsClinica,
            'rowsFarmacia' => $rowsFarmacia,
            'rowsHonorarios' => $rowsHonorarios,
            'totalClinica' => $totalClinica,
            'totalFarmacia' => $totalFarmacia,
            'totalHonorarios' => $totalHonorarios,
            'totalCobrar' => $totalCobrar,
            'totalPagaAhora' => $totalPagaAhora,
            'totalPagaLuego' => $totalPagaLuego,
            'fechaInicio' => $fechaInicio,
            'fechaFin' => $fechaFin,
            'tipoImpresion' => $tipoImpresion,
            'hoy' => $hoy,
        ])->setPaper('letter');

        return $pdf->stream('liquidacion_paciente_'.$paciente->id.'.pdf');
    }

    private function validatedData(Request $request): array
    {
        $request->merge([
            'formulario_detalle' => $this->normalizeFormularioDetalle($request->input('formulario_detalle')),
        ]);

        return $request->validate([
            'fecha' => 'required|date',
            'hora' => 'nullable|date_format:H:i',
            'paciente_id' => 'required|exists:pacientes,id',
            'doctor_id' => 'nullable|exists:doctores,id',
            'tipo_atencion' => 'nullable|in:Externo,Especialidad',
            'punto' => 'nullable|integer|in:0,1',
            'nombre_factura' => 'nullable|string|max:255',
            'numero_ficha' => 'nullable|string|max:255',
            'estado' => 'nullable|in:Activo,Anulado',
            'formulario_diagnostico' => 'nullable|string',
            'formulario_observaciones' => 'nullable|string',
            'formulario_detalle' => 'nullable|array',
            'formulario_detalle.caja_vaselina' => 'nullable|array',
            'formulario_detalle.caja_vaselina.*' => 'in:P,M,G',
            'formulario_detalle.caja_curacion' => 'nullable|array',
            'formulario_detalle.caja_curacion.*' => 'in:P,M,G',
            'formulario_detalle.caja_sutura' => 'nullable|array',
            'formulario_detalle.caja_sutura.*' => 'in:P,M,G',
            'formulario_detalle.caja_retiro_uterino' => 'nullable|array',
            'formulario_detalle.caja_retiro_uterino.*' => 'in:P,M,G',
            'formulario_detalle.caja_retiro_puntos' => 'nullable|array',
            'formulario_detalle.caja_retiro_puntos.*' => 'in:P,M,G',
            'formulario_detalle.sutura' => 'nullable|array',
            'formulario_detalle.sutura.*' => 'in:P,M,G',
            'formulario_detalle.uso_tela_adhesiva' => 'nullable|array',
            'formulario_detalle.uso_tela_adhesiva.*' => 'in:P,M,G',
            'formulario_detalle.uso_micropor' => 'nullable|array',
            'formulario_detalle.uso_micropor.*' => 'in:SI,NO',
            'formulario_detalle.nebulizacion' => 'nullable|array',
            'formulario_detalle.nebulizacion.*' => 'in:SI,NO',
            'formulario_detalle.glicemia' => 'nullable|array',
            'formulario_detalle.glicemia.*' => 'in:SI,NO',
            'formulario_detalle.inyectable' => 'nullable|array',
            'formulario_detalle.inyectable.*' => 'in:IM,EV,SC',
            'formulario_detalle.guantes_dediles' => 'nullable|array',
            'formulario_detalle.guantes_dediles.*' => 'in:SI,NO',
            'formulario_detalle.campo_fenestrado' => 'nullable|array',
            'formulario_detalle.campo_fenestrado.*' => 'in:SI,NO',
            'formulario_detalle.colocado_stopper' => 'nullable|array',
            'formulario_detalle.colocado_stopper.*' => 'in:SI,NO',
            'formulario_detalle.monitor_desfibrilador' => 'nullable|array',
            'formulario_detalle.monitor_desfibrilador.*' => 'in:SI,NO',
            'formulario_detalle.antisepticos' => 'nullable|array',
            'formulario_detalle.antisepticos.*' => 'in:SI,NO',
            'formulario_detalle.apositos_extras' => 'nullable|array',
            'formulario_detalle.apositos_extras.*' => 'in:SI,NO',
            'formulario_detalle.torundas_gasa_extras' => 'nullable|array',
            'formulario_detalle.torundas_gasa_extras.*' => 'in:SI,NO',
            'formulario_detalle.gases_extra' => 'nullable|array',
            'formulario_detalle.gases_extra.*' => 'in:SI,NO',
            'formulario_detalle.venda_quemado' => 'nullable|array',
            'formulario_detalle.venda_quemado.*' => 'in:SI,NO',
            'formulario_detalle.curacion' => 'nullable|array',
            'formulario_detalle.curacion.*' => 'in:P,M,G',
            'formulario_detalle.suero' => 'nullable|array',
            'formulario_detalle.suero.*' => 'in:SI,NO',
            'formulario_detalle.aspiracion' => 'nullable|array',
            'formulario_detalle.aspiracion.*' => 'in:SI,NO',
            'formulario_detalle.sonda' => 'nullable|array',
            'formulario_detalle.sonda.*' => 'in:SNG,SOG,SV',
            'formulario_detalle.compresas' => 'nullable|array',
            'formulario_detalle.compresas.*' => 'in:P,M,G',
            'formulario_detalle.yeso' => 'nullable|array',
            'formulario_detalle.yeso.*' => 'in:SI,NO',
            'formulario_detalle.oxigeno' => 'nullable|array',
            'formulario_detalle.oxigeno.*' => 'in:SI,NO',
            'formulario_detalle.enema' => 'nullable|array',
            'formulario_detalle.enema.*' => 'in:SI,NO',
            'formulario_detalle.corbatas' => 'nullable|array',
            'formulario_detalle.corbatas.*' => 'in:SI,NO',
            'formulario_detalle.algodon' => 'nullable|array',
            'formulario_detalle.algodon.*' => 'in:SI,NO',
            'estado_pago' => 'nullable|in:Ahora,Luego',
            'laboratorio_nombre' => 'nullable|string|max:255',
            'medico_ecografia' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string',
            'qr' => 'nullable|numeric|min:0',
            'efectivo' => 'nullable|numeric|min:0',
            'egreso' => 'nullable|numeric|min:0',
            'estado_cobro' => 'nullable|in:Pendiente,Pagado',
            'fecha_cobro' => 'nullable|date',
            'cobrado_por_user_id' => 'nullable|exists:users,id',
            'costo_atencion_medica' => 'nullable|numeric|min:0',
            'costo_curacion' => 'nullable|numeric|min:0',
            'costo_inyectable' => 'nullable|numeric|min:0',
            'costo_toma_presion' => 'nullable|numeric|min:0',
            'costo_ambulancia' => 'nullable|numeric|min:0',
            'costo_laboratorio' => 'nullable|numeric|min:0',
            'costo_ecografia' => 'nullable|numeric|min:0',
            'costo_uso_consultorio' => 'nullable|numeric|min:0',
            'costo_glicemia' => 'nullable|numeric|min:0',
            'costo_certificado_medico' => 'nullable|numeric|min:0',
            'costo_sutura' => 'nullable|numeric|min:0',
            'costo_antisepticos' => 'nullable|numeric|min:0',
            'costo_cama' => 'nullable|numeric|min:0',
            'costo_compania_noche' => 'nullable|numeric|min:0',
            'costo_uso_ecografia' => 'nullable|numeric|min:0',
            'costo_flebotomia' => 'nullable|numeric|min:0',
            'costo_sonda' => 'nullable|numeric|min:0',
            'costo_farmacia' => 'nullable|numeric|min:0',
            'otros_costos' => 'nullable|numeric|min:0',
        ]);
    }

    private function normalizeFormularioDetalle($detalle): mixed
    {
        if (!is_array($detalle)) {
            return $detalle;
        }

        return collect($detalle)->map(function ($value) {
            if ($value === null || $value === '' || $value === []) {
                return null;
            }

            if (is_array($value)) {
                $filtered = collect($value)
                    ->filter(fn ($item) => $item !== null && $item !== '')
                    ->unique()
                    ->values()
                    ->all();

                return empty($filtered) ? null : $filtered;
            }

            return [$value];
        })->all();
    }

    private function calculateRecaudadoTotal(array $data): float
    {
        return (float) collect(CajaRecepcion::COST_FIELDS)
            ->sum(fn ($field) => (float) ($data[$field] ?? 0));
    }

    private function buildRowsFromFields($items, array $fieldMap): array
    {
        return collect($fieldMap)
            ->map(function ($field, $label) use ($items) {
                $monto = (float) $items->sum(fn ($item) => (float) ($item->{$field} ?? 0));
                return [
                    'label' => $label,
                    'monto' => $monto,
                ];
            })
            ->filter(fn ($row) => $row['monto'] > 0)
            ->values()
            ->all();
    }
}
