<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activo_fijo_asignaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activo_fijo_id')->constrained('activos_fijos')->restrictOnDelete();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('asignado_por')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('devuelto_por')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('fecha_asignacion');
            $table->dateTime('fecha_devolucion')->nullable();
            $table->string('estado', 20)->default('Asignado');
            $table->text('observacion')->nullable();
            $table->text('observacion_devolucion')->nullable();
            $table->timestamps();

            $table->index(['activo_fijo_id', 'estado']);
            $table->index(['user_id', 'estado']);
            $table->index('fecha_asignacion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activo_fijo_asignaciones');
    }
};
