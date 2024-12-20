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
        Schema::create('receta_detalles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receta_id')->constrained('recetas');
            $table->foreignId('producto_id')->constrained('productos')->nullable();
            $table->integer('cantidad')->nullable();
            $table->string('unidad')->nullable();
            $table->string('productoNombre')->nullable();
            $table->string('via')->nullable();
            $table->string('frecuencia')->nullable();
            $table->string('duracion')->nullable();
            $table->string('indicaciones')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receta_detalles');
    }
};
