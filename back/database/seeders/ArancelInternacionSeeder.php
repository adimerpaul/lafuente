<?php

namespace Database\Seeders;

use App\Models\ArancelInternacion;
use Illuminate\Database\Seeder;

class ArancelInternacionSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['Medicina interna', null, 'Internación en servicio de medicina interna', 'Por día', 30],
            ['Medicina interna', null, 'Habitación privada (una sola cama)', 'Por día', 300],
            ['Medicina interna', null, 'Habitación común (sala de 2 camas)', 'Por día', 200],
            ['Medicina interna', null, 'Derecho de admisión', 'Único', 40],
            ['Medicina interna', null, 'Uso de sala de emergencia', 'Por uso', 150],
            ['Medicina interna', null, 'Uso de consultorio', 'Por uso', 50],

            ['Cirugía general', null, 'Habitación privada (una sola cama)', 'Por día', 300],
            ['Cirugía general', null, 'Habitación común (sala de 2 camas)', 'Por día', 200],
            ['Cirugía general', null, 'Derecho de admisión', 'Único', 40],
            ['Cirugía general', null, 'Uso de quirófano para cirugía compleja mayor', 'Por uso', 3000, 'Uso de quirófano durante tres horas'],
            ['Cirugía general', null, 'Uso de quirófano para cirugía mayor', 'Por uso', 2000, 'Uso de quirófano durante dos horas'],
            ['Cirugía general', null, 'Uso de quirófano para cirugía mediana', 'Por uso', 1300, 'Uso de quirófano durante una hora'],
            ['Cirugía general', null, 'Uso de quirófano para cirugía mínima', 'Por uso', 1000, 'Uso de quirófano durante media hora'],
            ['Cirugía general', null, 'Uso de sala séptica', 'Por uso', 300],
            ['Cirugía general', null, 'Cobro adicional por horas extras en cirugía', 'Por hora', 500],

            ['Unidad de terapia intensiva', null, 'Uso de sala de terapia intensiva', 'Por día', 2500],
            ['Unidad de terapia intensiva', null, 'Uso de monitor multiparamétrico', 'Por día', null],
            ['Unidad de terapia intensiva', null, 'Oxígeno', 'Por hora', null],
            ['Unidad de terapia intensiva', null, 'Uso de bomba de infusión', 'Pendiente', null],
            ['Unidad de terapia intensiva', null, 'Uso de ventilador mecánico', 'Por día', null],
            ['Unidad de terapia intensiva', null, 'Enfermera especialista UTI', 'Por turno de 6 horas', null],
            ['Unidad de terapia intensiva', null, 'Aspiración', 'Por día', null],
            ['Unidad de terapia intensiva', null, 'Bomba de infusión extra', 'Pendiente', 150],

            ['Enfermería', null, 'Oxígeno', 'Por hora', 30],
            ['Enfermería', null, 'Curación mayor', 'Por procedimiento', 60],
            ['Enfermería', null, 'Curación mediana', 'Por procedimiento', 40],
            ['Enfermería', null, 'Curación menor', 'Por procedimiento', 30],
            ['Enfermería', null, 'Nebulización', 'Por sesión', 30],
            ['Enfermería', null, 'Glicemia', 'Por procedimiento', 30],
            ['Enfermería', null, 'Aspiración', 'Por sesión', 15],
            ['Enfermería', null, 'Venda para quemados', 'Por unidad', 100],

            ['Procedimientos', null, 'Según orientación médica', 'Variable', null],
            ['Procedimientos', null, 'Uso de sala de yesos', 'Por uso', 100],
            ['Procedimientos', null, 'AMEU', 'Por procedimiento', 250],

            ['Traumatología', 'Servicio médico', 'Atención médica de emergencia', 'Por atención', 120],
            ['Traumatología', 'Servicio médico', 'Sutura', 'Por punto', null],
            ['Traumatología', 'Servicio médico', 'Lavado gástrico', 'Por procedimiento', null],
            ['Traumatología', 'Servicio médico', 'Aplicación de sonda Foley', 'Por procedimiento', null],
            ['Traumatología', 'Servicio médico', 'Curación mayor', 'Por procedimiento', 60],
            ['Traumatología', 'Servicio médico', 'Curación mediana', 'Por procedimiento', 40],
            ['Traumatología', 'Servicio médico', 'Curación menor', 'Por procedimiento', 30],
            ['Traumatología', 'Servicio médico', 'Retiro de puntos', 'Por procedimiento', 20],
            ['Traumatología', 'Servicio médico', 'Electrocardiograma', 'Por estudio', 200],
            ['Traumatología', 'Servicio médico', 'Glicemia', 'Por estudio', 30, 'Incluye lanceta y tira reactiva'],
            ['Traumatología', 'Servicio médico', 'Nebulización', 'Por día', 150],
            ['Traumatología', 'Servicio médico', 'Uso de bomba de infusión', 'Por uso', 150],
            ['Traumatología', 'Otros usos en pisos', 'Uso de monitor en sala', 'Por día', 250],
            ['Traumatología', 'Otros usos en pisos', 'Uso de bomba de infusión', 'Por día', 250],

            ['Otros', null, 'Servicio de ambulancia', 'Variable según distancia', 250],
            ['Otros', null, 'Curación extra posterior a internación por cirugía', 'Por procedimiento', 20],
            ['Otros', null, 'Caja de suturas', 'Por unidad', 30],
        ];

        foreach ($rows as $row) {
            [$categoria, $grupo, $nombre, $tipo, $precio] = $row;
            $detalle = $row[5] ?? null;
            $manual = str_contains($tipo, 'Variable');

            $arancel = ArancelInternacion::withTrashed()->firstOrNew([
                'categoria' => $categoria,
                'grupo' => $grupo,
                'nombre' => $nombre,
            ]);
            $arancel->fill([
                'detalle' => $detalle ?? null,
                'tipo_precio' => $tipo,
                'precio' => $precio,
                'permite_precio_manual' => $manual,
                'activo' => ($precio !== null && $tipo !== 'Pendiente') || $manual,
            ]);
            $arancel->deleted_at = null;
            $arancel->save();
        }
    }
}
