<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes')->restrictOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('finalizado_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_finalizacion')->nullable();
            $table->string('cama', 100);
            $table->string('estado', 20)->default('Activa');
            $table->text('observacion')->nullable();
            $table->timestamps();

            $table->index(['paciente_id', 'estado']);
            $table->index(['estado', 'fecha_inicio']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internaciones');
    }
};
