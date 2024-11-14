<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Material;
use App\Models\Periodo;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

//        User::factory()->create([
//            'name' => 'Test User',
//            'email' => 'test@example.com',
//        ]);
        Area::create(['nombre' => 'Unidad de Asuntos Administrativos']);
        for ($i = 0; $i < 10; $i++) {
            Area::create(['nombre' => 'Area ' . ($i+1)]);
        }

        User::create(['name' => 'Adminsitrador','username' => 'admin','password' => bcrypt('admin'),'area_id' => 1,'role' => 'Jefatura']);
        User::factory(10)->create();

        Material::create(['partida' => '32100', 'descripcion' => 'PAPEL BOND T/OFICIO', 'cantidad' => 6000, 'unidad' => 'Hojas', 'precio' => 0.084]);
        Material::create(['partida' => '32100', 'descripcion' => 'PAPEL BOND T/CARTA', 'cantidad' => 6000, 'unidad' => 'Hojas', 'precio' => 0.072]);
        Material::create(['partida' => '32100', 'descripcion' => 'Papel bond de color T/Carta', 'cantidad' => 2000, 'unidad' => 'Hojas', 'precio' => 0.158]);
        Material::create(['partida' => '32100', 'descripcion' => 'Papel bond de color T/Oficio', 'cantidad' => 2000, 'unidad' => 'Hojas', 'precio' => 0.17]);
        Material::create(['partida' => '32200', 'descripcion' => 'Papel carbónico tamaño oficio', 'cantidad' => 6, 'unidad' => 'Block', 'precio' => 1.03]);
        Material::create(['partida' => '25600', 'descripcion' => 'Papel Graf. Pliego de 80 grs.', 'cantidad' => 10, 'unidad' => 'Pzs.', 'precio' => 3.5]);
        Material::create(['partida' => '32200', 'descripcion' => 'Papel Sabana pliego', 'cantidad' => 5, 'unidad' => 'Pieza', 'precio' => 0.95]);
        Material::create(['partida' => '32200', 'descripcion' => 'PAPEL FOTOGRAFICO TAMAÑO OFICIO 240GRS.', 'cantidad' => 50, 'unidad' => 'Pieza', 'precio' => 4.5]);
        Material::create(['partida' => '32200', 'descripcion' => 'Papel Couche Tamaño oficio de 200 grs.', 'cantidad' => 30, 'unidad' => 'Pieza', 'precio' => 0.44]);
        Material::create(['partida' => '32200', 'descripcion' => 'Cartulina hilada, tamaño oficio', 'cantidad' => 50, 'unidad' => 'Pieza', 'precio' => 0.8]);
        Material::create(['partida' => '32200', 'descripcion' => 'Pestañas Multicolor Banderillas', 'cantidad' => 25, 'unidad' => 'Pieza', 'precio' => 3]);
        Material::create(['partida' => '32200', 'descripcion' => 'Cartulina de color T/Pliego', 'cantidad' => 10, 'unidad' => 'Hoja', 'precio' => 2.95]);
        Material::create(['partida' => '32200', 'descripcion' => 'Cuaderno Cuadriculado de 50 hojas', 'cantidad' => 2, 'unidad' => 'Pieza', 'precio' => 2.96]);
        Material::create(['partida' => '32200', 'descripcion' => 'Cuaderno Empastado 100 hojas T/ carta', 'cantidad' => 3, 'unidad' => 'Pieza', 'precio' => 18.47]);
        Material::create(['partida' => '32200', 'descripcion' => 'Cuaderno Empastado 100 hojas T/oficio', 'cantidad' => 3, 'unidad' => 'Pieza', 'precio' => 23.62]);
        Material::create(['partida' => '32200', 'descripcion' => 'Cuaderno Espiral 100 hojas T/carta', 'cantidad' => 4, 'unidad' => 'Pieza', 'precio' => 18]);
        Material::create(['partida' => '32200', 'descripcion' => 'Cuaderno Espiral 100 hojas T/ Oficio', 'cantidad' => 4, 'unidad' => 'Pieza', 'precio' => 23]);
        Material::create(['partida' => '32200', 'descripcion' => 'Sobre Manila T/Doble Oficio', 'cantidad' => 50, 'unidad' => 'Pieza', 'precio' => 3]);
        Material::create(['partida' => '32200', 'descripcion' => 'Sobre Manila T/ Oficio', 'cantidad' => 60, 'unidad' => 'Pieza', 'precio' => 0.85]);
        Material::create(['partida' => '32200', 'descripcion' => 'Sobre Manila T/Carta', 'cantidad' => 50, 'unidad' => 'Pieza', 'precio' => 0.8]);
        Material::create(['partida' => '32200', 'descripcion' => 'Archivador de palanca Cuarto Lomo', 'cantidad' => 8, 'unidad' => 'Pieza', 'precio' => 16]);
        Material::create(['partida' => '32200', 'descripcion' => 'Archivador de palanca Medio Lomo', 'cantidad' => 8, 'unidad' => 'Pieza', 'precio' => 18]);
        Material::create(['partida' => '32200', 'descripcion' => 'Archivador de palanca Lomo Entero', 'cantidad' => 8, 'unidad' => 'Pieza', 'precio' => 18]);
        Material::create(['partida' => '32200', 'descripcion' => 'Folder T/ oficio', 'cantidad' => 30, 'unidad' => 'Pieza', 'precio' => 0.95]);
        Material::create(['partida' => '32200', 'descripcion' => 'Folder T/ carta', 'cantidad' => 30, 'unidad' => 'Pieza', 'precio' => 0.95]);
        Material::create(['partida' => '32200', 'descripcion' => 'Flips T/Oficio', 'cantidad' => 30, 'unidad' => 'Pieza', 'precio' => 2]);
        Material::create(['partida' => '32200', 'descripcion' => 'Post It Note Tamaño Pequeño', 'cantidad' => 4, 'unidad' => 'Pieza', 'precio' => 3.5]);
        Material::create(['partida' => '32200', 'descripcion' => 'Post It Note Tamaño Mediano', 'cantidad' => 4, 'unidad' => 'Pieza', 'precio' => 4.5]);
        Material::create(['partida' => '32200', 'descripcion' => 'Post It Note Tamaño Grande', 'cantidad' => 4, 'unidad' => 'Pieza', 'precio' => 5.5]);
        Material::create(['partida' => '32200', 'descripcion' => 'Tablero t/oficio', 'cantidad' => 2, 'unidad' => 'Pieza', 'precio' => 18]);
        Material::create(['partida' => '39500', 'descripcion' => 'Lápiz color Azul', 'cantidad' => 10, 'unidad' => 'Pieza', 'precio' => 2.8]);

        Periodo::create(['periodo' => 2024, 'fecha_inicio' => '2024-01-01', 'fecha_fin' => '2024-12-31']);
    }
}
