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
use Spatie\Permission\Models\Permission;

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
//        User::create([
//            'name' => 'Administrador',
//            'username' => 'admin',
//            'email' => 'admin@test.com',
//            'password' => bcrypt('admin'),
//            'role' => 'Administrador',
//        ]);
//        User::factory(10)->create();
        $sqlFIle = base_path('database/seeders/productos.sql');
        $sqlContent = file_get_contents($sqlFIle);
        DB::unprepared($sqlContent);

        $sqlFIle = base_path('database/seeders/users.sql');
        $sqlContent = file_get_contents($sqlFIle);
        DB::unprepared($sqlContent);

        $permisos = [
            'Usuarios', 'Pacientes', 'Productos', 'Ventas', 'Nueva venta',
            'Proveedores', 'Compras', 'Compras nuevas', 'Productos por vencer',
            'Productos vencidos'
        ];
        foreach ($permisos as $permiso) {
            Permission::create(['name' => $permiso]);
        }
        $admin = User::find(1);
        $admin->givePermissionTo($permisos);
    }
}
