<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('caja_recepciones', function (Blueprint $table) {
            $table->text('formulario_diagnostico')->nullable()->after('numero_ficha');
            $table->json('formulario_detalle')->nullable()->after('formulario_diagnostico');
            $table->text('formulario_observaciones')->nullable()->after('formulario_detalle');
        });
    }

    public function down(): void
    {
        Schema::table('caja_recepciones', function (Blueprint $table) {
            $table->dropColumn([
                'formulario_diagnostico',
                'formulario_detalle',
                'formulario_observaciones',
            ]);
        });
    }
};
