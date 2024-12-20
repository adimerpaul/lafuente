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
        Schema::create('habitos_personales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes');
            $table->foreignId('user_id')->constrained('users');
            $table->boolean('fuma')->nullable();
            $table->boolean('alcohol')->nullable();
            $table->boolean('drogas')->nullable();
            $table->boolean('zoonosis')->nullable();
            $table->boolean('deportes')->nullable();
            $table->boolean('vacunas')->nullable();
            $table->dateTime('fecha')->useCurrent();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habitos_personales');
    }
};
