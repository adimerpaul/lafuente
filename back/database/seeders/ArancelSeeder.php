<?php

namespace Database\Seeders;

use App\Models\Arancel;
use Illuminate\Database\Seeder;

class ArancelSeeder extends Seeder
{
    private function precioAleatorio(): int
    {
        return random_int(50, 100);
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aranceles = [
            ['codigo' => 'caja_vaselinada_p', 'categoria' => 'Cajas', 'nombre' => 'Caja Vaselinada', 'presentacion' => 'Pequena', 'orden' => 1],
            ['codigo' => 'caja_vaselinada_m', 'categoria' => 'Cajas', 'nombre' => 'Caja Vaselinada', 'presentacion' => 'Mediana', 'orden' => 2],
            ['codigo' => 'caja_vaselinada_g', 'categoria' => 'Cajas', 'nombre' => 'Caja Vaselinada', 'presentacion' => 'Grande', 'orden' => 3],
            ['codigo' => 'caja_curacion_p', 'categoria' => 'Cajas', 'nombre' => 'Caja de Curacion', 'presentacion' => 'Pequena', 'orden' => 4],
            ['codigo' => 'caja_curacion_m', 'categoria' => 'Cajas', 'nombre' => 'Caja de Curacion', 'presentacion' => 'Mediana', 'orden' => 5],
            ['codigo' => 'caja_curacion_g', 'categoria' => 'Cajas', 'nombre' => 'Caja de Curacion', 'presentacion' => 'Grande', 'orden' => 6],
            ['codigo' => 'caja_sutura_p', 'categoria' => 'Cajas', 'nombre' => 'Caja de Sutura', 'presentacion' => 'Pequena', 'orden' => 7],
            ['codigo' => 'caja_sutura_m', 'categoria' => 'Cajas', 'nombre' => 'Caja de Sutura', 'presentacion' => 'Mediana', 'orden' => 8],
            ['codigo' => 'caja_sutura_g', 'categoria' => 'Cajas', 'nombre' => 'Caja de Sutura', 'presentacion' => 'Grande', 'orden' => 9],
            ['codigo' => 'caja_retiro_uretero_p', 'categoria' => 'Cajas', 'nombre' => 'Caja de Retiro de Uretero', 'presentacion' => 'Pequena', 'orden' => 10],
            ['codigo' => 'caja_retiro_uretero_m', 'categoria' => 'Cajas', 'nombre' => 'Caja de Retiro de Uretero', 'presentacion' => 'Mediana', 'orden' => 11],
            ['codigo' => 'caja_retiro_uretero_g', 'categoria' => 'Cajas', 'nombre' => 'Caja de Retiro de Uretero', 'presentacion' => 'Grande', 'orden' => 12],
            ['codigo' => 'caja_retiro_puntos_p', 'categoria' => 'Cajas', 'nombre' => 'Caja de Retiro de Puntos', 'presentacion' => 'Pequena', 'orden' => 13],
            ['codigo' => 'caja_retiro_puntos_m', 'categoria' => 'Cajas', 'nombre' => 'Caja de Retiro de Puntos', 'presentacion' => 'Mediana', 'orden' => 14],
            ['codigo' => 'caja_retiro_puntos_g', 'categoria' => 'Cajas', 'nombre' => 'Caja de Retiro de Puntos', 'presentacion' => 'Grande', 'orden' => 15],
            ['codigo' => 'sutura_p', 'categoria' => 'Procedimientos', 'nombre' => 'Sutura', 'presentacion' => 'Pequena', 'orden' => 16],
            ['codigo' => 'sutura_m', 'categoria' => 'Procedimientos', 'nombre' => 'Sutura', 'presentacion' => 'Mediana', 'orden' => 17],
            ['codigo' => 'sutura_g', 'categoria' => 'Procedimientos', 'nombre' => 'Sutura', 'presentacion' => 'Grande', 'orden' => 18],
            ['codigo' => 'uso_tela_adhesiva', 'categoria' => 'Insumos', 'nombre' => 'Uso de Tela Adhesiva', 'presentacion' => null, 'orden' => 19],
            ['codigo' => 'uso_micropor', 'categoria' => 'Insumos', 'nombre' => 'Uso de Micropor', 'presentacion' => null, 'orden' => 20],
            ['codigo' => 'nebulizacion', 'categoria' => 'Procedimientos', 'nombre' => 'Nebulizacion', 'presentacion' => null, 'orden' => 21],
            ['codigo' => 'glicemia', 'categoria' => 'Procedimientos', 'nombre' => 'Glicemia', 'presentacion' => null, 'orden' => 22],
            ['codigo' => 'inyectable_im', 'categoria' => 'Procedimientos', 'nombre' => 'Inyectable', 'presentacion' => 'I.M.', 'orden' => 23],
            ['codigo' => 'inyectable_ev', 'categoria' => 'Procedimientos', 'nombre' => 'Inyectable', 'presentacion' => 'E.V.', 'orden' => 24],
            ['codigo' => 'inyectable_sc', 'categoria' => 'Procedimientos', 'nombre' => 'Inyectable', 'presentacion' => 'S.C.', 'orden' => 25],
            ['codigo' => 'guantes_dediles', 'categoria' => 'Insumos', 'nombre' => 'Guantes (Dediles)', 'presentacion' => null, 'orden' => 26],
            ['codigo' => 'campo_fenestrado', 'categoria' => 'Insumos', 'nombre' => 'Campo Fenestrado', 'presentacion' => null, 'orden' => 27],
            ['codigo' => 'colocado_stopper', 'categoria' => 'Procedimientos', 'nombre' => 'Colocado de Stopper', 'presentacion' => null, 'orden' => 28],
            ['codigo' => 'monitor_desfibrilador', 'categoria' => 'Soporte', 'nombre' => 'Monitor - Desfibrilador', 'presentacion' => null, 'orden' => 29],
            ['codigo' => 'antisepticos', 'categoria' => 'Insumos', 'nombre' => 'Antisepticos', 'presentacion' => null, 'orden' => 30],
            ['codigo' => 'apositos_extras', 'categoria' => 'Insumos', 'nombre' => 'Apositos extras', 'presentacion' => null, 'orden' => 31],
            ['codigo' => 'torundas_gasa_extras', 'categoria' => 'Insumos', 'nombre' => 'Torundas de gasa extras', 'presentacion' => null, 'orden' => 32],
            ['codigo' => 'gasas_extra', 'categoria' => 'Insumos', 'nombre' => 'Gasas Extra', 'presentacion' => null, 'orden' => 33],
            ['codigo' => 'venda_quemado', 'categoria' => 'Insumos', 'nombre' => 'Venda de Quemado', 'presentacion' => null, 'orden' => 34],
            ['codigo' => 'curacion_p', 'categoria' => 'Procedimientos', 'nombre' => 'Curacion', 'presentacion' => 'Pequena', 'orden' => 35],
            ['codigo' => 'curacion_m', 'categoria' => 'Procedimientos', 'nombre' => 'Curacion', 'presentacion' => 'Mediana', 'orden' => 36],
            ['codigo' => 'curacion_g', 'categoria' => 'Procedimientos', 'nombre' => 'Curacion', 'presentacion' => 'Grande', 'orden' => 37],
            ['codigo' => 'suero', 'categoria' => 'Soporte', 'nombre' => 'Suero', 'presentacion' => null, 'orden' => 38],
            ['codigo' => 'aspiracion', 'categoria' => 'Procedimientos', 'nombre' => 'Aspiracion', 'presentacion' => null, 'orden' => 39],
            ['codigo' => 'sonda_sng', 'categoria' => 'Procedimientos', 'nombre' => 'Sonda', 'presentacion' => 'SNG', 'orden' => 40],
            ['codigo' => 'sonda_sog', 'categoria' => 'Procedimientos', 'nombre' => 'Sonda', 'presentacion' => 'SOG', 'orden' => 41],
            ['codigo' => 'sonda_sv', 'categoria' => 'Procedimientos', 'nombre' => 'Sonda', 'presentacion' => 'SV', 'orden' => 42],
            ['codigo' => 'compresas', 'categoria' => 'Insumos', 'nombre' => 'Compresas', 'presentacion' => null, 'orden' => 43],
            ['codigo' => 'yeso_p', 'categoria' => 'Procedimientos', 'nombre' => 'Yeso', 'presentacion' => 'Pequena', 'orden' => 44],
            ['codigo' => 'yeso_m', 'categoria' => 'Procedimientos', 'nombre' => 'Yeso', 'presentacion' => 'Mediana', 'orden' => 45],
            ['codigo' => 'yeso_g', 'categoria' => 'Procedimientos', 'nombre' => 'Yeso', 'presentacion' => 'Grande', 'orden' => 46],
            ['codigo' => 'oxigeno', 'categoria' => 'Soporte', 'nombre' => 'Oxigeno', 'presentacion' => null, 'orden' => 47],
            ['codigo' => 'enema', 'categoria' => 'Procedimientos', 'nombre' => 'Enema', 'presentacion' => null, 'orden' => 48],
            ['codigo' => 'corbatas', 'categoria' => 'Insumos', 'nombre' => 'Corbatas', 'presentacion' => null, 'orden' => 49],
            ['codigo' => 'algodon', 'categoria' => 'Insumos', 'nombre' => 'Algodon', 'presentacion' => null, 'orden' => 50],
        ];

        foreach ($aranceles as $arancel) {
            Arancel::updateOrCreate(
                ['codigo' => $arancel['codigo']],
                $arancel + ['precio' => $this->precioAleatorio()]
            );
        }
    }
}
