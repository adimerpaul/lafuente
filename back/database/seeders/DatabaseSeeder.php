<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Material;
use App\Models\Paciente;
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
        User::create([
            'name' => 'Adminstrador',
            'username' => 'admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('admin'),
        ]);
        User::factory(10)->create();
        Paciente::factory(1000)->create();
    }
}
