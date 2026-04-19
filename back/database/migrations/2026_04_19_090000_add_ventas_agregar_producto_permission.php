<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    public function up(): void
    {
        $permission = Permission::firstOrCreate(['name' => 'Ventas agregar producto']);

        User::query()
            ->where('role', 'Administrador')
            ->get()
            ->each(function (User $user) use ($permission) {
                $user->givePermissionTo($permission);
            });

        User::query()
            ->whereRaw('LOWER(name) = ?', ['ariel garcia'])
            ->get()
            ->each(function (User $user) use ($permission) {
                $user->givePermissionTo($permission);
            });
    }

    public function down(): void
    {
        Permission::where('name', 'Ventas agregar producto')->delete();
    }
};
