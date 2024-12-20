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
        Schema::create('antecedentes_familiares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes');
            $table->foreignId('user_id')->constrained('users');
            $table->boolean('tuberculosis')->nullable();
            $table->boolean('diabetes')->nullable();
            $table->boolean('hipertension')->nullable();
            $table->boolean('cardiopatia')->nullable();
            $table->boolean('neumopatia')->nullable();
            $table->boolean('hepatopatia')->nullable();
            $table->boolean('nefropatia')->nullable();
            $table->boolean('endocrinopatia')->nullable();
            $table->boolean('epilepsia')->nullable();
            $table->boolean('asma')->nullable();
            $table->boolean('enfermedades_hematologicas')->nullable();
            $table->boolean('neoplasias')->nullable();
            $table->boolean('enfermedades_congenitas')->nullable();
            $table->boolean('enfermedades_mentales')->nullable();
            $table->boolean('vih')->nullable();
            $table->boolean('violencia')->nullable();
            $table->text('otros')->nullable();
            $table->text('observaciones')->nullable();
            $table->text('parentesco')->nullable();
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
        Schema::dropIfExists('antecedentes_familiares');
    }
};
