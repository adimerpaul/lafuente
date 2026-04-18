<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    public function up(): void
    {
        Permission::firstOrCreate(['name' => 'Traspaso']);
    }

    public function down(): void
    {
        Permission::where('name', 'Traspaso')->delete();
    }
};
