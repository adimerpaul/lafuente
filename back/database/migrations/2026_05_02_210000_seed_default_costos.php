<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $costos = [
            ['nombre' => 'Atencion medica', 'icono' => 'medical_services', 'color' => 'indigo', 'orden' => 1],
            ['nombre' => 'Procedimiento medico', 'icono' => 'content_cut', 'color' => 'teal-7', 'orden' => 2],
            ['nombre' => 'Enfermeria', 'icono' => 'vaccines', 'color' => 'pink-7', 'orden' => 3],
            ['nombre' => 'Insumos', 'icono' => 'inventory_2', 'color' => 'brown-7', 'orden' => 4],
            ['nombre' => 'Laboratorio', 'icono' => 'science', 'color' => 'blue-7', 'orden' => 5],
            ['nombre' => 'Ecografia', 'icono' => 'pregnant_woman', 'color' => 'purple-8', 'orden' => 6],
            ['nombre' => 'Consultorio', 'icono' => 'door_front', 'color' => 'brown-6', 'orden' => 7],
            ['nombre' => 'Farmacia', 'icono' => 'local_pharmacy', 'color' => 'green-7', 'orden' => 8],
            ['nombre' => 'Tomografia', 'icono' => 'biotech', 'color' => 'deep-purple-7', 'orden' => 9],
            ['nombre' => 'Fisioterapia', 'icono' => 'directions_run', 'color' => 'orange-9', 'orden' => 10],
            ['nombre' => 'Odontologia', 'icono' => 'water_drop', 'color' => 'cyan-7', 'orden' => 11],
        ];

        foreach ($costos as $costo) {
            $exists = DB::table('costos')->where('nombre', $costo['nombre'])->exists();

            if ($exists) {
                DB::table('costos')
                    ->where('nombre', $costo['nombre'])
                    ->update($costo + [
                        'categoria' => null,
                        'activo' => true,
                        'deleted_at' => null,
                        'updated_at' => $now,
                    ]);
                continue;
            }

            DB::table('costos')->insert($costo + [
                'categoria' => null,
                'activo' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->syncAranceles('Procedimiento medico', function ($query) {
            $query->where('categoria', 'Procedimientos');
        });

        $this->syncAranceles('Enfermeria', function ($query) {
            $query->whereIn('codigo', [
                'inyectable_im',
                'inyectable_ev',
                'inyectable_sc',
                'glicemia',
                'sonda_sng',
                'sonda_sog',
                'sonda_sv',
                'curacion_p',
                'curacion_m',
                'curacion_g',
                'nebulizacion',
                'colocado_stopper',
                'aspiracion',
                'enema',
                'oxigeno',
                'suero',
            ]);
        });

        $this->syncAranceles('Insumos', function ($query) {
            $query->whereIn('categoria', ['Insumos', 'Cajas']);
        });
    }

    public function down(): void
    {
        DB::table('costos')
            ->whereIn('nombre', [
                'Atencion medica',
                'Procedimiento medico',
                'Enfermeria',
                'Insumos',
                'Laboratorio',
                'Ecografia',
                'Consultorio',
                'Farmacia',
                'Tomografia',
                'Fisioterapia',
                'Odontologia',
            ])
            ->delete();
    }

    private function syncAranceles(string $costoNombre, callable $filter): void
    {
        $costoId = DB::table('costos')->where('nombre', $costoNombre)->value('id');
        if (! $costoId) {
            return;
        }

        $query = DB::table('aranceles')->select('id');
        $filter($query);

        $now = now();
        foreach ($query->pluck('id') as $arancelId) {
            DB::table('costo_arancel')->updateOrInsert(
                [
                    'costo_id' => $costoId,
                    'arancel_id' => $arancelId,
                ],
                [
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
};
