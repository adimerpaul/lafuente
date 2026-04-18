<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    public function up(): void
    {
        $newPermisos = [
            'Productos farmacia',
            'Productos farmacia institucional',
            'Ventas farmacia',
            'Ventas farmacia institucional',
            'Ventas nuevas farmacia',
            'Ventas nuevas farmacia institucional',
            'Compras farmacia',
            'Compras farmacia institucional',
            'Compras nuevas farmacia',
            'Compras nuevas farmacia institucional',
            'Productos por vencer farmacia',
            'Productos por vencer farmacia institucional',
            'Productos vencidos farmacia',
            'Productos vencidos farmacia institucional',
        ];

        foreach ($newPermisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso]);
        }
    }

    public function down(): void
    {
        $permisos = [
            'Productos farmacia',
            'Productos farmacia institucional',
            'Ventas farmacia',
            'Ventas farmacia institucional',
            'Ventas nuevas farmacia',
            'Ventas nuevas farmacia institucional',
            'Compras farmacia',
            'Compras farmacia institucional',
            'Compras nuevas farmacia',
            'Compras nuevas farmacia institucional',
            'Productos por vencer farmacia',
            'Productos por vencer farmacia institucional',
            'Productos vencidos farmacia',
            'Productos vencidos farmacia institucional',
        ];

        foreach ($permisos as $permiso) {
            Permission::where('name', $permiso)->delete();
        }
    }
};
