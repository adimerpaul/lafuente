<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('caja_recepcion_costos', function (Blueprint $table) {
            $table->unsignedTinyInteger('doctor_porcentaje')->default(20)->after('monto');
        });
    }

    public function down(): void
    {
        Schema::table('caja_recepcion_costos', function (Blueprint $table) {
            $table->dropColumn('doctor_porcentaje');
        });
    }
};
