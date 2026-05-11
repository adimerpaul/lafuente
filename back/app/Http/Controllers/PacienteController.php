<?php

namespace App\Http\Controllers;

use App\Models\PacienteAlta;
use App\Models\Paciente;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PacienteController extends Controller{
    function index(Request $request) {
        $search = $request->search;
        $estadoInternacion = $request->input('estado_internacion');
        $fechaAltaInicio = $request->input('fecha_alta_inicio');
        $fechaAltaFin = $request->input('fecha_alta_fin');

        $pacientes = Paciente::with(['registroUser', 'altaUser'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('nombre', 'like', "%$search%")
                        ->orWhere('apellido', 'like', "%$search%")
                        ->orWhere('identificacion', 'like', "%$search%")
                        ->orWhereRaw('CONCAT(nombre, " ", apellido) LIKE ?', ["%$search%"])
                        ->orWhereRaw('CONCAT(apellido, " ", nombre) LIKE ?', ["%$search%"]);
                });
            })
            ->when($estadoInternacion, fn($query) => $query->where('estado_internacion', $estadoInternacion))
            ->when($fechaAltaInicio && $fechaAltaFin, fn($query) => $query->whereBetween('fecha_alta', [
                $fechaAltaInicio . ' 00:00:00',
                $fechaAltaFin . ' 23:59:59'
            ]))
            ->orderBy('nombre')
            ->orderBy('apellido')
            ->paginate(20);

        return response()->json($pacientes);
    }
    function store(Request $request){
        $request->merge([
            'fecha_creacion' => now(),
            'user_id' => auth()->id(),
            'estado_internacion' => $request->input('tipo_paciente') === 'Interno' ? 'Internado' : 'No internado',
        ]);
        return response()->json(Paciente::create($request->all()));
    }
    function show(Paciente $paciente){
//        function cobros(){
//            return $this->hasMany(Cobro::class);
//        }
//        function facturas(){
//            return $this->hasMany(Factura::class);
//        }
//        function pagos(){
//            return $this->hasMany(Pago::class);
//        }
        return Paciente::with(
            'historialMedicos.user',
            'signosVitales.user','antecedentesFamiliares.user',
            'habitosPersonales.user',
            'recetas.user',
            'recetas.recetaDetalles.producto',
            'diagnosticos.user',
            'pacienteVentas.user',
            'pacienteVentas.venta',
            'pacienteVentas.venta.pagadoInternoPor',
            'cobros.user',
            'facturas.user',
            'pagos.user',
            'formulariosControl.user',
            'registroUser',
            'altaUser',
            'altas.user',
        )->find($paciente->id);
    }
    function update(Request $request, Paciente $paciente){
        $data = $request->all();

        if (($data['tipo_paciente'] ?? $paciente->tipo_paciente) === 'Interno' && empty($paciente->fecha_alta)) {
            $data['estado_internacion'] = 'Internado';
        }

        if (($data['tipo_paciente'] ?? $paciente->tipo_paciente) !== 'Interno' && empty($paciente->fecha_alta)) {
            $data['estado_internacion'] = 'No internado';
        }

        $paciente->update($data);
        return response()->json($paciente->load(['registroUser', 'altaUser']));
    }
    function darAlta(Paciente $paciente){
        if ($paciente->tipo_paciente !== 'Interno') {
            return response()->json(['message' => 'Solo se puede dar de alta a pacientes internos.'], 422);
        }

        if ($paciente->estado_internacion === 'Alta') {
            return response()->json(['message' => 'El paciente ya fue dado de alta.'], 422);
        }

        DB::transaction(function () use ($paciente) {
            $estadoAnterior = $paciente->estado_internacion;
            $fechaAlta = now();

            $paciente->update([
                'estado_internacion' => 'Alta',
                'fecha_alta' => $fechaAlta,
                'alta_user_id' => auth()->id(),
            ]);

            PacienteAlta::create([
                'paciente_id' => $paciente->id,
                'user_id' => auth()->id(),
                'accion' => 'Alta',
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => 'Alta',
                'fecha_hora' => $fechaAlta,
            ]);
        });

        return response()->json($paciente->load(['registroUser', 'altaUser', 'altas.user']));
    }
    function limpiarAlta(Paciente $paciente){
        if ($paciente->tipo_paciente !== 'Interno') {
            return response()->json(['message' => 'Solo se puede cambiar el alta de pacientes internos.'], 422);
        }

        if ($paciente->estado_internacion !== 'Alta' && empty($paciente->fecha_alta)) {
            return response()->json(['message' => 'El paciente no tiene alta registrada.'], 422);
        }

        DB::transaction(function () use ($paciente) {
            $estadoAnterior = $paciente->estado_internacion;
            $fechaCambio = now();

            $paciente->update([
                'estado_internacion' => 'Internado',
                'fecha_alta' => null,
                'alta_user_id' => null,
            ]);

            PacienteAlta::create([
                'paciente_id' => $paciente->id,
                'user_id' => auth()->id(),
                'accion' => 'Alta vacia',
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => 'Internado',
                'fecha_hora' => $fechaCambio,
            ]);
        });

        return response()->json($paciente->load(['registroUser', 'altaUser', 'altas.user']));
    }
    function reportePdf(Request $request){
        $fechaAltaInicio = $request->input('fecha_alta_inicio');
        $fechaAltaFin = $request->input('fecha_alta_fin');

        $internos = Paciente::with(['registroUser', 'altaUser'])
            ->where('tipo_paciente', 'Interno')
            ->where('estado_internacion', 'Internado')
            ->orderBy('apellido')
            ->orderBy('nombre')
            ->get();

        $altas = Paciente::with(['registroUser', 'altaUser'])
            ->where('tipo_paciente', 'Interno')
            ->where('estado_internacion', 'Alta')
            ->orderByDesc('fecha_alta')
            ->orderBy('apellido')
            ->orderBy('nombre')
            ->get();

        $altasRango = collect();
        if ($fechaAltaInicio && $fechaAltaFin) {
            $altasRango = Paciente::with(['registroUser', 'altaUser'])
                ->where('tipo_paciente', 'Interno')
                ->where('estado_internacion', 'Alta')
                ->whereBetween('fecha_alta', [
                    $fechaAltaInicio . ' 00:00:00',
                    $fechaAltaFin . ' 23:59:59'
                ])
                ->orderByDesc('fecha_alta')
                ->orderBy('apellido')
                ->orderBy('nombre')
                ->get();
        }

        $pdf = Pdf::loadView('pdf.pacientes_reporte', [
            'internos' => $internos,
            'altas' => $altas,
            'altasRango' => $altasRango,
            'fechaAltaInicio' => $fechaAltaInicio,
            'fechaAltaFin' => $fechaAltaFin,
            'generadoEn' => now(),
        ])->setPaper('letter', 'landscape');

        return $pdf->stream('pacientes_reporte.pdf');
    }
    function reporteAltasBajas(Request $request){
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin    = $request->input('fecha_fin');

        $altasQuery = Paciente::with(['registroUser', 'altaUser'])
            ->where('tipo_paciente', 'Interno')
            ->where('estado_internacion', 'Alta');

        if ($fechaInicio && $fechaFin) {
            $altasQuery->whereBetween('fecha_alta', [
                $fechaInicio . ' 00:00:00',
                $fechaFin . ' 23:59:59',
            ]);
        }

        $altas = $altasQuery->orderByDesc('fecha_alta')->orderBy('apellido')->get();

        $bajasQuery = Paciente::withTrashed()
            ->with(['registroUser'])
            ->whereNotNull('deleted_at');

        if ($fechaInicio && $fechaFin) {
            $bajasQuery->whereBetween('deleted_at', [
                $fechaInicio . ' 00:00:00',
                $fechaFin . ' 23:59:59',
            ]);
        }

        $bajas = $bajasQuery->orderByDesc('deleted_at')->orderBy('apellido')->get()->makeVisible('deleted_at');

        return response()->json(['altas' => $altas, 'bajas' => $bajas]);
    }
    function reporteAltasBajasPdf(Request $request){
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');

        $altasQuery = Paciente::with(['registroUser', 'altaUser'])
            ->where('tipo_paciente', 'Interno')
            ->where('estado_internacion', 'Alta');

        if ($fechaInicio && $fechaFin) {
            $altasQuery->whereBetween('fecha_alta', [
                $fechaInicio . ' 00:00:00',
                $fechaFin . ' 23:59:59',
            ]);
        }

        $altas = $altasQuery->orderByDesc('fecha_alta')->orderBy('apellido')->get();

        $bajasQuery = Paciente::withTrashed()
            ->with(['registroUser'])
            ->whereNotNull('deleted_at');

        if ($fechaInicio && $fechaFin) {
            $bajasQuery->whereBetween('deleted_at', [
                $fechaInicio . ' 00:00:00',
                $fechaFin . ' 23:59:59',
            ]);
        }

        $bajas = $bajasQuery->orderByDesc('deleted_at')->orderBy('apellido')->get();

        $pdf = Pdf::loadView('pdf.pacientes_altas_bajas', [
            'altas'        => $altas,
            'bajas'        => $bajas,
            'fechaInicio'  => $fechaInicio,
            'fechaFin'     => $fechaFin,
            'generadoEn'   => now(),
        ])->setPaper('letter', 'landscape');

        return $pdf->stream('reporte_altas_bajas.pdf');
    }
    function exportarInternoAlta(){
        $pacientes = Paciente::with(['altaUser'])
            ->where('tipo_paciente', 'Interno')
            ->where('estado_internacion', 'Alta')
            ->orderByDesc('fecha_alta')
            ->orderBy('apellido')
            ->orderBy('nombre')
            ->get(['id','nombre','apellido','identificacion','edad','sexo','estado_civil','direccion','telefono','fecha_alta','alta_user_id']);

        return response()->json($pacientes);
    }
    function destroy(Paciente $paciente){
        $paciente->delete();
        return response()->json($paciente);
    }
}
