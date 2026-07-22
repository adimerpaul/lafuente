<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $usuarios = [
        ['name' => 'Fabiola Cuevas Marquez', 'primer_nombre' => 'Fabiola', 'ci' => '7505654'],
        ['name' => 'Juan Daniel Pinto Arias', 'primer_nombre' => 'Juan', 'ci' => '7388347'],
        ['name' => 'Nayra Shirley Garnica Perez', 'primer_nombre' => 'Nayra', 'ci' => '2273288'],
        ['name' => 'Jhon Salvador Pinto Muñoz', 'primer_nombre' => 'Jhon', 'ci' => '12459181'],
    ];

    private array $permisos = [
        'Caja recepcion',
        'Caja recepcion crear',
    ];

    public function up(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        foreach ($this->permisos as $permiso) {
            DB::table('permissions')->updateOrInsert(
                ['name' => $permiso, 'guard_name' => 'web'],
                ['updated_at' => now(), 'created_at' => now()]
            );
        }

        $permisoIds = DB::table('permissions')->whereIn('name', $this->permisos)->pluck('id', 'name');

        foreach ($this->usuarios as $u) {
            $username = $this->resolveUsername($u['primer_nombre']);

            $userId = DB::table('users')->where('username', $username)->value('id');

            if (! $userId) {
                $userId = DB::table('users')->insertGetId([
                    'name' => $u['name'],
                    'username' => $username,
                    'password' => bcrypt($u['ci']),
                    'role' => 'Recepcion',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach ($this->permisos as $permiso) {
                DB::table('model_has_permissions')->updateOrInsert([
                    'permission_id' => $permisoIds[$permiso],
                    'model_type' => 'App\\Models\\User',
                    'model_id' => $userId,
                ]);
            }
        }
    }

    public function down(): void
    {
        foreach ($this->usuarios as $u) {
            $userId = DB::table('users')
                ->where('name', $u['name'])
                ->where('role', 'Recepcion')
                ->value('id');

            if (! $userId) {
                continue;
            }

            DB::table('model_has_permissions')
                ->where('model_type', 'App\\Models\\User')
                ->where('model_id', $userId)
                ->delete();

            DB::table('users')->where('id', $userId)->delete();
        }
    }

    /**
     * Usa el primer nombre como username; si ya existe (de otro usuario), agrega 1, 2, 3...
     */
    private function resolveUsername(string $primerNombre): string
    {
        $candidato = $primerNombre;
        $sufijo = 1;

        while (DB::table('users')->where('username', $candidato)->exists()) {
            $candidato = $primerNombre.$sufijo;
            $sufijo++;
        }

        return $candidato;
    }
};
