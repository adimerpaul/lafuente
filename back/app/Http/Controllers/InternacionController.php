<?php

namespace App\Http\Controllers;

use App\Exports\InternacionArancelesExcelExport;
use App\Models\ArancelInternacion;
use App\Models\Internacion;
use App\Models\InternacionArancel;
use App\Models\Paciente;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InternacionController extends Controller
{
    public function pacientes(Request $request)
    {
        $data = $request->validate([
            'search' => 'nullable|string|max:100',
            'per_page' => 'nullable|integer|min:5|max:100',
        ]);
        $search = trim($data['search'] ?? '');

        return Paciente::query()
            ->with('internacionActiva')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('nombre', 'like', "%{$search}%")
                        ->orWhere('apellido', 'like', "%{$search}%")
                        ->orWhere('identificacion', 'like', "%{$search}%")
                        ->orWhereRaw('CONCAT(nombre, " ", apellido) LIKE ?', ["%{$search}%"])
                        ->orWhereRaw('CONCAT(apellido, " ", nombre) LIKE ?', ["%{$search}%"]);
                });
            })
            ->orderBy('apellido')
            ->orderBy('nombre')
            ->paginate($data['per_page'] ?? 10);
    }

    public function resumen(Paciente $paciente)
    {
        $paciente->load([
            'internaciones.user',
            'internaciones.finalizadoPor',
            'internaciones.arancelesAplicados.user',
            'cajaRecepciones' => fn ($query) => $query
                ->with(['user', 'doctor'])
                ->orderByDesc('fecha')
                ->orderByDesc('hora'),
            'pacienteVentas' => fn ($query) => $query->with([
                'user',
                'venta.user',
                'venta.ventaDetalles.producto',
            ])->orderByDesc('fecha')->orderByDesc('hora'),
        ]);

        return response()->json($paciente);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'paciente_id' => 'required|integer|exists:pacientes,id',
            'fecha_inicio' => 'required|date',
            'cama' => 'required|string|max:100',
            'observacion' => 'nullable|string|max:1000',
        ]);

        $internacion = DB::transaction(function () use ($data, $request) {
            $paciente = Paciente::lockForUpdate()->findOrFail($data['paciente_id']);
            $tieneActiva = Internacion::where('paciente_id', $paciente->id)
                ->where('estado', 'Activa')
                ->lockForUpdate()
                ->exists();

            if ($tieneActiva) {
                throw ValidationException::withMessages([
                    'paciente_id' => 'El paciente ya tiene una internación activa.',
                ]);
            }

            $internacion = Internacion::create([
                ...$data,
                'cama' => trim($data['cama']),
                'estado' => 'Activa',
                'user_id' => $request->user()->id,
            ]);

            $paciente->update([
                'tipo_paciente' => 'Interno',
                'estado_internacion' => 'Internado',
                'fecha_alta' => null,
                'alta_user_id' => null,
            ]);

            return $internacion;
        });

        return response()->json($internacion->load(['paciente', 'user']), 201);
    }

    public function finalizar(Request $request, Internacion $internacion)
    {
        $data = $request->validate([
            'fecha_finalizacion' => 'required|date|after_or_equal:'.$internacion->fecha_inicio->format('Y-m-d H:i:s'),
        ]);

        DB::transaction(function () use ($internacion, $data, $request) {
            $internacion = Internacion::lockForUpdate()->findOrFail($internacion->id);
            if ($internacion->estado !== 'Activa') {
                throw ValidationException::withMessages([
                    'fecha_finalizacion' => 'La internación ya fue finalizada.',
                ]);
            }

            $internacion->update([
                'fecha_finalizacion' => $data['fecha_finalizacion'],
                'estado' => 'Finalizada',
                'finalizado_user_id' => $request->user()->id,
            ]);
            $internacion->paciente()->update([
                'estado_internacion' => 'Alta',
                'fecha_alta' => $data['fecha_finalizacion'],
                'alta_user_id' => $request->user()->id,
            ]);
        });

        return response()->json($internacion->fresh()->load(['paciente', 'user', 'finalizadoPor']));
    }

    public function aplicarArancel(Request $request, Internacion $internacion)
    {
        $data = $request->validate([
            'arancel_internacion_id' => 'required|integer|exists:arancel_internaciones,id',
            'cantidad' => 'required|numeric|min:0.01|max:99999',
            'precio_unitario' => 'nullable|numeric|min:0|max:99999999.99',
            'observacion' => 'nullable|string|max:1000',
        ]);

        $arancel = ArancelInternacion::findOrFail($data['arancel_internacion_id']);
        if (! $arancel->activo) {
            throw ValidationException::withMessages(['arancel_internacion_id' => 'El arancel está inactivo.']);
        }

        $precio = array_key_exists('precio_unitario', $data) && $data['precio_unitario'] !== null
            ? $data['precio_unitario']
            : $arancel->precio;

        if ($precio === null) {
            throw ValidationException::withMessages(['precio_unitario' => 'Debe ingresar el precio del arancel.']);
        }

        $aplicado = InternacionArancel::create([
            'internacion_id' => $internacion->id,
            'arancel_internacion_id' => $arancel->id,
            'user_id' => $request->user()->id,
            'categoria' => $arancel->categoria,
            'nombre' => $arancel->nombre,
            'tipo_precio' => $arancel->tipo_precio,
            'precio_unitario' => $precio,
            'cantidad' => $data['cantidad'],
            'total' => round((float) $precio * (float) $data['cantidad'], 2),
            'fecha_hora' => now(),
            'observacion' => $data['observacion'] ?? null,
        ]);

        return response()->json($aplicado->load('user'), 201);
    }

    public function update(Request $request, Internacion $internacion)
    {
        $data = $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_finalizacion' => 'nullable|date|after_or_equal:fecha_inicio',
            'cama' => 'required|string|max:100',
            'observacion' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($internacion, $data, $request) {
            if (empty($data['fecha_finalizacion'])) {
                $otraActiva = Internacion::where('paciente_id', $internacion->paciente_id)
                    ->where('estado', 'Activa')
                    ->whereKeyNot($internacion->id)
                    ->lockForUpdate()
                    ->exists();

                if ($otraActiva) {
                    throw ValidationException::withMessages([
                        'fecha_finalizacion' => 'El paciente ya tiene otra internación activa.',
                    ]);
                }
            }

            $internacion->update($data);

            if ($internacion->fecha_finalizacion) {
                $internacion->update([
                    'estado' => 'Finalizada',
                    'finalizado_user_id' => $request->user()->id,
                ]);
                if (! Internacion::where('paciente_id', $internacion->paciente_id)
                    ->where('estado', 'Activa')->whereKeyNot($internacion->id)->exists()) {
                    $internacion->paciente()->update([
                        'estado_internacion' => 'Alta',
                        'fecha_alta' => $internacion->fecha_finalizacion,
                        'alta_user_id' => $request->user()->id,
                    ]);
                }
            } else {
                $internacion->update([
                    'estado' => 'Activa',
                    'finalizado_user_id' => null,
                ]);
                $internacion->paciente()->update([
                    'tipo_paciente' => 'Interno',
                    'estado_internacion' => 'Internado',
                    'fecha_alta' => null,
                    'alta_user_id' => null,
                ]);
            }
        });

        return response()->json(
            $internacion->fresh()->load(['user', 'finalizadoPor', 'arancelesAplicados.user'])
        );
    }

    public function arancelesPdf(Internacion $internacion)
    {
        $internacion->load([
            'paciente',
            'user',
            'finalizadoPor',
            'arancelesAplicados.user',
        ]);

        $pdf = Pdf::loadView('pdf.internacion_aranceles', [
            'internacion' => $internacion,
            'total' => $internacion->arancelesAplicados->sum('total'),
            'generadoEn' => now(),
        ])->setPaper('letter', 'landscape');

        return $pdf->stream("internacion-{$internacion->id}-aranceles.pdf");
    }

    public function arancelesExcel(Internacion $internacion)
    {
        $internacion->load([
            'paciente',
            'user',
            'finalizadoPor',
            'arancelesAplicados.user',
        ]);

        return (new InternacionArancelesExcelExport($internacion))->download();
    }

    public function destroy(Request $request, Internacion $internacion)
    {
        DB::transaction(function () use ($internacion, $request) {
            $eraActiva = $internacion->estado === 'Activa';
            $internacion->delete();

            if ($eraActiva) {
                $otraActiva = Internacion::where('paciente_id', $internacion->paciente_id)
                    ->where('estado', 'Activa')
                    ->latest('fecha_inicio')
                    ->first();

                if ($otraActiva) {
                    $internacion->paciente()->update([
                        'tipo_paciente' => 'Interno',
                        'estado_internacion' => 'Internado',
                        'fecha_alta' => null,
                        'alta_user_id' => null,
                    ]);
                } else {
                    $internacion->paciente()->update([
                        'estado_internacion' => 'Alta',
                        'fecha_alta' => now(),
                        'alta_user_id' => $request->user()->id,
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Internación eliminada correctamente.',
        ]);
    }
}
