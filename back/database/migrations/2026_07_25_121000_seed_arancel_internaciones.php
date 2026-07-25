<?php

use Database\Seeders\ArancelInternacionSeeder;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        (new ArancelInternacionSeeder)->run();
    }

    public function down(): void
    {
        // Los aranceles pueden tener historial aplicado; no se eliminan al revertir la carga.
    }
};
