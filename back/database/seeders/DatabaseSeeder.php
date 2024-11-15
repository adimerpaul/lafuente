<?php

namespace Database\Seeders;

use App\Models\AntecedentesFamiliare;
use App\Models\Area;
use App\Models\HabitosPersonale;
use App\Models\HistorialMedico;
use App\Models\Material;
use App\Models\Paciente;
use App\Models\Periodo;
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
            'name' => 'Adminstrador',
            'username' => 'admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('admin'),
        ]);
        User::factory(10)->create();
        $sqlFIle = base_path('database/seeders/productos_202411150418.sql');
        $sqlContent = file_get_contents($sqlFIle);

        DB::unprepared($sqlContent);

        $paciente = Paciente::factory()->create();
        $historial = HistorialMedico::factory()->create([
            'paciente_id' => $paciente->id,
        ]);
        $signosVitales = SignosVitale::factory()->create([
            'paciente_id' => $paciente->id,
        ]);
        $antecedentesFamiliares = AntecedentesFamiliare::factory()->create([
            'paciente_id' => $paciente->id,
        ]);
        $habitosPersonales = HabitosPersonale::factory()->create([
            'paciente_id' => $paciente->id,
        ]);

        Paciente::factory(1000)->create();
    }
}
