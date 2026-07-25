<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activos_fijos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('codigo', 80)->nullable()->unique();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->decimal('valor', 14, 2);
            $table->date('fecha_compra');
            $table->date('fecha_fin');
            $table->decimal('depreciacion_mensual', 14, 2);
            $table->string('estado', 30)->default('Activo');
            $table->string('foto')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['estado', 'nombre']);
            $table->index(['fecha_compra', 'fecha_fin']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activos_fijos');
    }
};
