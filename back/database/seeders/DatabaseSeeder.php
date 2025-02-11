<?php

namespace Database\Seeders;

use App\Models\AntecedentesFamiliare;
use App\Models\Area;
use App\Models\Diagnostico;
use App\Models\HabitosPersonale;
use App\Models\HistorialMedico;
use App\Models\Material;
use App\Models\Paciente;
use App\Models\Periodo;
use App\Models\Receta;
use App\Models\RecetaDetalle;
use App\Models\SignosVitale;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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
        User::create([
            'name' => 'Administrador',
            'username' => 'admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('admin'),
            'role' => 'Administrador',
        ]);
        User::factory(10)->create();
        $sqlFIle = base_path('database/seeders/productos_202411150418.sql');
        $sqlContent = file_get_contents($sqlFIle);

        DB::unprepared($sqlContent);

        $paciente = Paciente::factory()->create();
        $historial = HistorialMedico::factory()->create([
            'paciente_id' => $paciente->id,
            'user_id' => rand(1, 11),
        ]);
        $signosVitales = SignosVitale::factory()->create([
            'paciente_id' => $paciente->id,
            'user_id' => rand(1, 11),
        ]);
        $antecedentesFamiliares = AntecedentesFamiliare::factory()->create([
            'paciente_id' => $paciente->id,
            'user_id' => rand(1, 11),
        ]);
        $habitosPersonales = HabitosPersonale::factory()->create([
            'paciente_id' => $paciente->id,
            'user_id' => rand(1, 11),
        ]);

        $diagnostico = Diagnostico::factory()->create([
            'paciente_id' => $paciente->id,
            'user_id' => rand(1, 11),
        ]);

        Paciente::factory(1)->create();

//        Schema::create('recetas', function (Blueprint $table) {
//            $table->id();
//            $table->foreignId('paciente_id')->constrained('pacientes');
//            $table->foreignId('user_id')->constrained('users');
//            $table->text('indicaciones')->nullable();
//            $table->text('observaciones')->nullable();
//            $table->dateTime('fecha')->useCurrent();
//            $table->softDeletes();
//            $table->timestamps();
//        });
//        Schema::create('receta_detalles', function (Blueprint $table) {
//            $table->id();
//            $table->foreignId('receta_id')->constrained('recetas');
//            $table->foreignId('producto_id')->constrained('productos');
//            $table->integer('cantidad')->nullable();
//            $table->string('unidad')->nullable();
//            $table->string('via')->nullable();
//            $table->string('frecuencia')->nullable();
//            $table->string('duracion')->nullable();
//            $table->string('indicaciones')->nullable();
//            $table->softDeletes();
//            $table->timestamps();
//        });

        $receta = Receta::create([
            'paciente_id' => $paciente->id,
            'user_id' => rand(1, 11),
            'indicaciones' => 'Tomar con agua',
            'observaciones' => 'No tomar con el estomago vacio',
        ]);

        $recetaDetalle = RecetaDetalle::create([
            'receta_id' => $receta->id,
            'producto_id' => rand(1, 1000),
            'productoNombre' => 'Paracetamol',
            'cantidad' => 1,
            'unidad' => 'pastilla',
            'via' => 'oral',
            'frecuencia' => 'cada 8 horas',
            'duracion' => '3 dias',
            'indicaciones' => 'Tomar con agua',
        ]);
        $recetaDetalle = RecetaDetalle::create([
            'receta_id' => $receta->id,
            'producto_id' => rand(1, 1000),
            'productoNombre' => 'Ibuprofeno',
            'cantidad' => 1,
            'unidad' => 'pastilla',
            'via' => 'oral',
            'frecuencia' => 'cada 8 horas',
            'duracion' => '3 dias',
            'indicaciones' => 'Tomar con agua',
        ]);
        $recetaDetalle = RecetaDetalle::create([
            'receta_id' => $receta->id,
            'producto_id' => rand(1, 1000),
            'productoNombre' => 'Amoxicilina',
            'cantidad' => 1,
            'unidad' => 'pastilla',
            'via' => 'oral',
            'frecuencia' => 'cada 8 horas',
            'duracion' => '3 dias',
            'indicaciones' => 'Tomar con agua',
        ]);
    }
}
