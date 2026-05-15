<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    public function up(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permission = Permission::firstOrCreate([
            'name' => 'Pacientes internados farmacia institucional',
            'guard_name' => 'web',
        ]);

        User::query()
            ->where('role', 'Administrador')
            ->get()
            ->each(function (User $user) use ($permission) {
                $user->givePermissionTo($permission);
            });
    }

    public function down(): void
    {
        Permission::where('name', 'Pacientes internados farmacia institucional')->delete();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
