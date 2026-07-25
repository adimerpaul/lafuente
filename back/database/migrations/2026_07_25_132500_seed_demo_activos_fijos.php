<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $activos = [
            ['codigo' => 'DEMO-AF-001', 'nombre' => 'Ecógrafo digital', 'valor' => 48500, 'fecha_compra' => '2024-01-15', 'fecha_fin' => '2029-01-15', 'depreciacion_mensual' => 808.33],
            ['codigo' => 'DEMO-AF-002', 'nombre' => 'Cama hospitalaria eléctrica', 'valor' => 12500, 'fecha_compra' => '2023-06-01', 'fecha_fin' => '2033-06-01', 'depreciacion_mensual' => 104.17],
            ['codigo' => 'DEMO-AF-003', 'nombre' => 'Monitor multiparamétrico', 'valor' => 22000, 'fecha_compra' => '2024-03-10', 'fecha_fin' => '2029-03-10', 'depreciacion_mensual' => 366.67],
            ['codigo' => 'DEMO-AF-004', 'nombre' => 'Concentrador de oxígeno', 'valor' => 9800, 'fecha_compra' => '2023-09-20', 'fecha_fin' => '2028-09-20', 'depreciacion_mensual' => 163.33],
            ['codigo' => 'DEMO-AF-005', 'nombre' => 'Autoclave clínica', 'valor' => 35000, 'fecha_compra' => '2022-11-05', 'fecha_fin' => '2030-11-05', 'depreciacion_mensual' => 364.58],
            ['codigo' => 'DEMO-AF-006', 'nombre' => 'Refrigerador para medicamentos', 'valor' => 6800, 'fecha_compra' => '2024-02-01', 'fecha_fin' => '2029-02-01', 'depreciacion_mensual' => 113.33],
            ['codigo' => 'DEMO-AF-007', 'nombre' => 'Computadora administrativa', 'valor' => 7200, 'fecha_compra' => '2025-01-10', 'fecha_fin' => '2029-01-10', 'depreciacion_mensual' => 150],
            ['codigo' => 'DEMO-AF-008', 'nombre' => 'Impresora multifuncional', 'valor' => 3900, 'fecha_compra' => '2025-02-15', 'fecha_fin' => '2029-02-15', 'depreciacion_mensual' => 81.25],
            ['codigo' => 'DEMO-AF-009', 'nombre' => 'Aire acondicionado de internación', 'valor' => 14500, 'fecha_compra' => '2023-12-01', 'fecha_fin' => '2031-12-01', 'depreciacion_mensual' => 151.04],
            ['codigo' => 'DEMO-AF-010', 'nombre' => 'Generador eléctrico de emergencia', 'valor' => 56000, 'fecha_compra' => '2022-08-18', 'fecha_fin' => '2032-08-18', 'depreciacion_mensual' => 466.67],
        ];

        foreach ($activos as $activo) {
            DB::table('activos_fijos')->updateOrInsert(
                ['codigo' => $activo['codigo']],
                array_merge($activo, [
                    'descripcion' => 'Activo ficticio creado por migración para demostración.',
                    'estado' => 'Activo',
                    'foto' => null,
                    'deleted_at' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }

    public function down(): void
    {
        DB::table('activos_fijos')
            ->where('codigo', 'like', 'DEMO-AF-%')
            ->where('descripcion', 'Activo ficticio creado por migración para demostración.')
            ->delete();
    }
};
