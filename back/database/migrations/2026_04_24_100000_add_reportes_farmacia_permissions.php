<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    public function up(): void
    {
        $permisos = [
            'Reportes farmacia',
            'Reportes farmacia institucional',
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(['name' => $permiso]);
        }
    }

    public function down(): void
    {
        $permisos = [
            'Reportes farmacia',
            'Reportes farmacia institucional',
        ];

        foreach ($permisos as $permiso) {
            Permission::where('name', $permiso)->delete();
        }
    }
};

