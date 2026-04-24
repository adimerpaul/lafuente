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
            'Productos farmacia',
            'Productos farmacia institucional',
            'Ventas',
            'Ventas farmacia',
            'Ventas farmacia institucional',
            'Ventas nuevas',
            'Ventas nuevas farmacia',
            'Ventas nuevas farmacia institucional',
            'Proveedores',
            'Compras',
            'Compras farmacia',
            'Compras farmacia institucional',
            'Compras nuevas',
            'Compras nuevas farmacia',
            'Compras nuevas farmacia institucional',
            'Reportes farmacia',
            'Reportes farmacia institucional',
            'Productos por vencer',
            'Productos por vencer farmacia',
            'Productos por vencer farmacia institucional',
            'Productos vencidos',
            'Productos vencidos farmacia',
            'Productos vencidos farmacia institucional',
            'Precio de ventas productos',
            'Traspaso',
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
