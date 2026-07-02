<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private string $permiso = 'Caja recepcion editar';

    private array $usernames = ['admin', 'Deymar', 'giovana'];

    public function up(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        DB::table('permissions')->updateOrInsert(
            ['name' => $this->permiso, 'guard_name' => 'web'],
            ['updated_at' => now(), 'created_at' => now()]
        );

        $permisoId = DB::table('permissions')->where('name', $this->permiso)->value('id');

        $userIds = DB::table('users')->whereIn('username', $this->usernames)->pluck('id');

        foreach ($userIds as $userId) {
            DB::table('model_has_permissions')->updateOrInsert([
                'permission_id' => $permisoId,
                'model_type' => 'App\\Models\\User',
                'model_id' => $userId,
            ]);
        }
    }

    public function down(): void
    {
        $permisoId = DB::table('permissions')->where('name', $this->permiso)->value('id');

        if ($permisoId) {
            DB::table('model_has_permissions')->where('permission_id', $permisoId)->delete();
        }

        DB::table('permissions')->where('name', $this->permiso)->delete();
    }
};
