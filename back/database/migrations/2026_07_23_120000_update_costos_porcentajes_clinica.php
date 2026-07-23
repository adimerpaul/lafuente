<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Porcentaje que retiene la clinica (CLI %) por cada costo,
     * segun el formato de reporte diario de recepcion.
     * El resto (100 - porcentaje) corresponde al tercero (doctor/servicio).
     */
    private const PORCENTAJES = [
        'atencion medica' => 20,
        'atencion emergencia' => 20,
        'procedimiento medico' => 20,
        'laboratorio' => 30,
        'ecografia' => 70,
        'tomografia' => 20,
        'fisioterapia' => 20,
        'odontologia' => 20,
        'enfermeria' => 100,
        'insumos' => 100,
        'consultorio' => 100,
        'farmacia' => 100,
    ];

    public function up(): void
    {
        $now = now();

        foreach (self::PORCENTAJES as $nombre => $porcentaje) {
            DB::table('costos')
                ->whereRaw('LOWER(TRIM(nombre)) = ?', [$nombre])
                ->update([
                    'porcentaje' => $porcentaje,
                    'updated_at' => $now,
                ]);
        }
    }

    public function down(): void
    {
        $now = now();

        DB::table('costos')
            ->whereIn(DB::raw('LOWER(TRIM(nombre))'), array_keys(self::PORCENTAJES))
            ->update([
                'porcentaje' => 100,
                'updated_at' => $now,
            ]);
    }
};
