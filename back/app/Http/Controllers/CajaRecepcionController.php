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
                                ->orWhere('identificacion', 'like', "%{$search}%");
                        });
                });
            });

        $items = $query->orderByDesc('fecha')->orderByDesc('id')->get();

        $resumen = [
            'total_recaudado' => (float) $items->sum('recaudado_total'),
            'total_ingresos' => (float) $items->where('tipo_movimiento', 'Ingreso')->sum('recaudado_total'),
            'total_egresos' => (float) $items->where('tipo_movimiento', 'Egreso')->sum('recaudado_total'),
            'total_qr' => (float) $items->sum('qr'),
            'total_efectivo' => (float) $items->sum('efectivo'),
            'total_farmacia' => (float) $items->sum('costo_farmacia'),
            'total_final' => (float) $items->where('tipo_movimiento', 'Ingreso')->sum('recaudado_total')
                - (float) $items->where('tipo_movimiento', 'Egreso')->sum('recaudado_total')
                - (float) $items->sum('costo_farmacia'),
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
        $cajaRecepcion->delete();

        return response()->json(null, 204);
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'fecha' => 'required|date',
            'paciente_id' => 'required|exists:pacientes,id',
            'doctor_id' => 'nullable|exists:doctores,id',
            'tipo_atencion' => 'nullable|in:Externo,Especialidad',
            'punto' => 'nullable|integer|in:0,1',
            'nombre_factura' => 'nullable|string|max:255',
            'numero_ficha' => 'nullable|string|max:255',
            'estado_pago' => 'nullable|in:Ahora,Luego',
            'laboratorio_nombre' => 'nullable|string|max:255',
            'medico_ecografia' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string',
            'qr' => 'nullable|numeric|min:0',
            'efectivo' => 'nullable|numeric|min:0',
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

    private function calculateRecaudadoTotal(array $data): float
    {
        return (float) collect(CajaRecepcion::COST_FIELDS)
            ->sum(fn ($field) => (float) ($data[$field] ?? 0));
    }
}
