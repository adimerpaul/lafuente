<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permisos = [
            'Usuarios',
            'Doctores',
            'Pacientes',
            'Productos',
            'Ventas',
            'Nueva venta',
            'Proveedores',
            'Compras',
            'Compras nuevas',
            'Productos por vencer',
            'Productos vencidos',
            'Precio de ventas productos',
            'Aranceles',
            'Formularios control',
            'Formulario control nuevo',
            'Caja recepcion',
            'Caja recepcion crear',
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso]);
        }

        $admin = User::find(1);
        if ($admin) {
            $admin->givePermissionTo($permisos);
        }
    }
}
