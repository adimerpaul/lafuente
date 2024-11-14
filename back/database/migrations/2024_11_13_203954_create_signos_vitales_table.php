<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('signos_vitales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes');
            $table->string('estado_general')->nullable();
            $table->integer('fc')->nullable();  // Frecuencia cardíaca
            $table->integer('fr')->nullable();  // Frecuencia respiratoria
            $table->integer('pa')->nullable();  // Presión arterial
            $table->decimal('temperatura', 5, 2)->nullable();
            $table->decimal('peso', 5, 2)->nullable();
            $table->decimal('talla', 5, 2)->nullable();
            $table->decimal('imc', 5, 2)->nullable(); // Índice de Masa Corporal
            $table->integer('spo2')->nullable();
            $table->integer('glasgow')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signos_vitales');
    }
};
