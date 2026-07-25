<?php

namespace App\Http\Controllers;

use App\Exports\FuncionarioActivosExcelExport;
use App\Models\ActivoFijo;
use App\Models\ActivoFijoAsignacion;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ActivoFijoController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $perPage = min(max((int) $request->input('per_page', 20), 1), 100);

        return ActivoFijo::with([
            'user:id,name',
            'asignacionActual.funcionario:id,name,role',
        ])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('nombre', 'like', "%{$search}%")
                        ->orWhere('codigo', 'like', "%{$search}%")
                        ->orWhere('descripcion', 'like', "%{$search}%");
                });
            })
            ->orderBy('nombre')
            ->paginate($perPage);
    }

    public function store(Request $request)
    {
        $data = $this->validatedData($request);
        $data['user_id'] = auth()->id();
        $data['foto'] = $this->storePhoto($request);

        return response()->json(ActivoFijo::create($data)->fresh('user:id,name'), 201);
    }

    public function update(Request $request, ActivoFijo $activoFijo)
    {
        $data = $this->validatedData($request, $activoFijo);

        if ($request->hasFile('foto')) {
            $this->deletePhoto($activoFijo->foto);
            $data['foto'] = $this->storePhoto($request);
        }

        $activoFijo->update($data);

        return response()->json($activoFijo->fresh('user:id,name'));
    }

    public function destroy(ActivoFijo $activoFijo)
    {
        if ($activoFijo->asignaciones()->where('estado', 'Asignado')->exists()) {
            return response()->json([
                'message' => 'Debe registrar la devolución del activo antes de eliminarlo.',
            ], 422);
        }

        $activoFijo->delete();

        return response()->json(null, 204);
    }

    public function funcionarios()
    {
        return User::query()
            ->select(['id', 'name', 'role'])
            ->with(['asignacionesActivos' => function ($query) {
                $query->where('estado', 'Asignado')
                    ->with('activoFijo:id,codigo,nombre,foto,estado,valor');
            }])
            ->withCount(['asignacionesActivos as activos_asignados_count' => fn ($query) => $query->where('estado', 'Asignado')])
            ->orderBy('name')
            ->get();
    }

    public function funcionarioDetalle(User $user)
    {
        $user->load([
            'asignacionesActivos' => function ($query) {
                $query->with([
                    'activoFijo:id,codigo,nombre,descripcion,foto,estado,valor,fecha_compra',
                    'asignador:id,name,role',
                    'receptorDevolucion:id,name,role',
                ])->orderByDesc('fecha_asignacion');
            },
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'role' => $user->role,
            'email' => $user->email,
            'activos_actuales' => $user->asignacionesActivos
                ->where('estado', 'Asignado')
                ->values(),
            'historial' => $user->asignacionesActivos->values(),
        ]);
    }

    public function funcionarioActivosPdf(User $user)
    {
        $rows = $this->activosActualesFuncionario($user);

        return Pdf::loadView('pdf.funcionario_activos', [
            'funcionario' => $user,
            'rows' => $rows,
            'generatedAt' => now()->format('d/m/Y H:i'),
        ])->setPaper('a4', 'landscape')
            ->download('activos_funcionario_'.$user->id.'_'.now()->format('Ymd_His').'.pdf');
    }

    public function funcionarioActivosExcel(User $user)
    {
        return (new FuncionarioActivosExcelExport(
            $user,
            $this->activosActualesFuncionario($user)->toArray()
        ))->download();
    }

    public function detalle(ActivoFijo $activoFijo)
    {
        return response()->json($activoFijo->load([
            'user:id,name,role',
            'asignaciones' => function ($query) {
                $query->with([
                    'funcionario:id,name,username,role,email',
                    'asignador:id,name,role',
                    'receptorDevolucion:id,name,role',
                ])->orderByDesc('fecha_asignacion');
            },
        ]));
    }

    public function asignaciones(ActivoFijo $activoFijo)
    {
        return $activoFijo->asignaciones()
            ->with([
                'funcionario:id,name,role',
                'asignador:id,name',
                'receptorDevolucion:id,name',
            ])
            ->orderByDesc('fecha_asignacion')
            ->get();
    }

    public function asignar(Request $request, ActivoFijo $activoFijo)
    {
        $data = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'fecha_asignacion' => 'required|date',
            'observacion' => 'nullable|string|max:2000',
        ]);

        $asignacion = DB::transaction(function () use ($data, $activoFijo) {
            $activo = ActivoFijo::lockForUpdate()->findOrFail($activoFijo->id);

            if ($activo->asignaciones()->where('estado', 'Asignado')->exists()) {
                abort(422, 'El activo ya se encuentra asignado. Registre primero su devolución.');
            }

            return ActivoFijoAsignacion::create([
                'activo_fijo_id' => $activo->id,
                'user_id' => $data['user_id'],
                'asignado_por' => auth()->id(),
                'fecha_asignacion' => $data['fecha_asignacion'],
                'estado' => 'Asignado',
                'observacion' => $data['observacion'] ?? null,
            ]);
        });

        return response()->json($asignacion->load('funcionario:id,name,role'), 201);
    }

    public function asignarVarios(Request $request)
    {
        $data = $request->validate([
            'activo_ids' => 'required|array|min:1',
            'activo_ids.*' => 'required|integer|distinct|exists:activos_fijos,id',
            'user_id' => 'required|integer|exists:users,id',
            'fecha_asignacion' => 'required|date',
            'observacion' => 'nullable|string|max:2000',
        ]);

        $asignaciones = DB::transaction(function () use ($data) {
            $activos = ActivoFijo::query()
                ->whereIn('id', $data['activo_ids'])
                ->orderBy('id')
                ->lockForUpdate()
                ->get();

            $resultado = collect();

            foreach ($activos as $activo) {
                $actual = $activo->asignaciones()
                    ->where('estado', 'Asignado')
                    ->lockForUpdate()
                    ->first();

                if ($actual) {
                    if ((int) $actual->user_id === (int) $data['user_id']) {
                        abort(422, "El activo {$activo->nombre} ya está asignado a ese funcionario.");
                    }

                    if ($actual->fecha_asignacion->gt($data['fecha_asignacion'])) {
                        abort(422, "La fecha de cambio de {$activo->nombre} no puede ser anterior a su asignación actual.");
                    }

                    $actual->update([
                        'devuelto_por' => auth()->id(),
                        'fecha_devolucion' => $data['fecha_asignacion'],
                        'estado' => 'Devuelto',
                        'observacion_devolucion' => 'Transferencia directa a otro funcionario.',
                    ]);
                }

                $resultado->push(ActivoFijoAsignacion::create([
                    'activo_fijo_id' => $activo->id,
                    'user_id' => $data['user_id'],
                    'asignado_por' => auth()->id(),
                    'fecha_asignacion' => $data['fecha_asignacion'],
                    'estado' => 'Asignado',
                    'observacion' => $data['observacion'] ?? null,
                ]));
            }

            return $resultado;
        });

        return response()->json([
            'message' => $asignaciones->count().' activos asignados correctamente.',
            'cantidad' => $asignaciones->count(),
        ], 201);
    }

    public function devolver(Request $request, ActivoFijoAsignacion $asignacion)
    {
        $data = $request->validate([
            'fecha_devolucion' => 'required|date|after_or_equal:'.$asignacion->fecha_asignacion->format('Y-m-d H:i:s'),
            'observacion_devolucion' => 'nullable|string|max:2000',
        ]);

        if ($asignacion->estado !== 'Asignado') {
            return response()->json(['message' => 'La asignación ya fue devuelta.'], 422);
        }

        $asignacion->update([
            'devuelto_por' => auth()->id(),
            'fecha_devolucion' => $data['fecha_devolucion'],
            'estado' => 'Devuelto',
            'observacion_devolucion' => $data['observacion_devolucion'] ?? null,
        ]);

        return response()->json($asignacion->fresh([
            'funcionario:id,name,role',
            'receptorDevolucion:id,name',
        ]));
    }

    private function validatedData(Request $request, ?ActivoFijo $activoFijo = null): array
    {
        $id = $activoFijo?->id;

        return $request->validate([
            'codigo' => "nullable|string|max:80|unique:activos_fijos,codigo,{$id}",
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:2000',
            'valor' => 'required|numeric|min:0',
            'fecha_compra' => 'required|date',
            'fecha_fin' => 'required|date|after:fecha_compra',
            'depreciacion_mensual' => 'required|numeric|min:0',
            'estado' => 'required|in:Activo,En mantenimiento,Dado de baja',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);
    }

    private function activosActualesFuncionario(User $user)
    {
        return $user->asignacionesActivos()
            ->where('estado', 'Asignado')
            ->with([
                'activoFijo:id,codigo,nombre,estado,valor',
                'asignador:id,name,role',
            ])
            ->orderByDesc('fecha_asignacion')
            ->get();
    }

    private function storePhoto(Request $request): ?string
    {
        if (! $request->hasFile('foto')) {
            return null;
        }

        $directory = public_path('images/activos-fijos');
        File::ensureDirectoryExists($directory);
        $file = $request->file('foto');
        $fileName = Str::uuid().'.'.$file->getClientOriginalExtension();
        $file->move($directory, $fileName);

        return $fileName;
    }

    private function deletePhoto(?string $fileName): void
    {
        if ($fileName) {
            File::delete(public_path('images/activos-fijos/'.$fileName));
        }
    }
}
