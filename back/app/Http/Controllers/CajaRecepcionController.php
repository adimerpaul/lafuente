<?php

namespace App\Http\Controllers;

use App\Models\CajaRecepcion;
use Illuminate\Http\Request;

class CajaRecepcionController extends Controller
{
    public function index(Request $request)
    {
        $fechaInicio = $request->get('fechaInicio');
        $fechaFin = $request->get('fechaFin');
        $userId = $request->get('user_id');
        $search = trim((string) $request->get('search', ''));

        $query = CajaRecepcion::with(['user', 'paciente', 'doctor'])
            ->when($fechaInicio, fn ($q) => $q->whereDate('fecha', '>=', $fechaInicio))
            ->when($fechaFin, fn ($q) => $q->whereDate('fecha', '<=', $fechaFin))
            ->when($userId, fn ($q) => $q->where('user_id', $userId))
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

        $items = $query->orderByDesc('fecha')->orderByDesc('id')->get();
        $activeItems = $items->where('estado', '!=', 'Anulado');

        $resumen = [
            'total_recaudado' => (float) $activeItems->sum('recaudado_total'),
            'total_ingresos' => (float) $activeItems->sum('recaudado_total'),
            'total_egresos' => (float) $activeItems->sum('egreso'),
            'total_qr' => (float) $activeItems->sum('qr'),
            'total_efectivo' => (float) $activeItems->sum('efectivo'),
            'total_farmacia' => (float) $activeItems->sum('costo_farmacia'),
            'total_final' => (float) $activeItems->sum('efectivo')
                - (float) $activeItems->sum('egreso'),
        ];

        return response()->json([
            'data' => $items,
            'summary' => $resumen,
        ]);
    }

    public function show(CajaRecepcion $cajaRecepcion)
    {
        return CajaRecepcion::with(['user', 'paciente', 'doctor'])->findOrFail($cajaRecepcion->id);
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

        return response()->json($cajaRecepcion->load(['user', 'paciente', 'doctor']), 201);
    }

    public function update(Request $request, CajaRecepcion $cajaRecepcion)
    {
        $data = $this->validatedData($request);
        $data['user_id'] = $request->user()->id;
        $data['tipo_movimiento'] = 'Ingreso';
        $data['tipo_documento'] = (int) (($data['punto'] ?? 0) === 1);
        $data['recaudado_total'] = $this->calculateRecaudadoTotal($data);

        $cajaRecepcion->update($data);

        return response()->json($cajaRecepcion->load(['user', 'paciente', 'doctor']));
    }

    public function destroy(CajaRecepcion $cajaRecepcion)
    {
        $cajaRecepcion->update([
            'estado' => 'Anulado',
        ]);

        return response()->json(null, 204);
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
}
