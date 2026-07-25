<?php

namespace Database\Seeders;

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

        $this->call(PermissionSeeder::class);
        $this->call(ArancelInternacionSeeder::class);
        $this->call(ArancelSeeder::class);
    }
}
