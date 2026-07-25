<?php

namespace App\Http\Controllers;

use App\Models\Internacion;
use App\Models\Paciente;
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
            'cobros' => fn ($query) => $query->with('user')->orderByDesc('fecha'),
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
}
