<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('costos', function (Blueprint $table) {
            $table->decimal('porcentaje', 5, 2)->default(100)->change();
        });

        DB::table('costos')->update(['porcentaje' => 100]);
    }

    public function down(): void
    {
        Schema::table('costos', function (Blueprint $table) {
            $table->decimal('porcentaje', 5, 2)->default(0)->change();
        });
    }
};
