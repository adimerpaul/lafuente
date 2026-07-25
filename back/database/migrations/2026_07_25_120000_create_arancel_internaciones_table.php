<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('arancel_internaciones', function (Blueprint $table) {
            $table->id();
            $table->string('categoria', 100);
            $table->string('grupo', 120)->nullable();
            $table->string('nombre', 180);
            $table->string('detalle')->nullable();
            $table->string('tipo_precio', 40);
            $table->decimal('precio', 10, 2)->nullable();
            $table->boolean('permite_precio_manual')->default(false);
            $table->boolean('activo')->default(true);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['categoria', 'activo']);
            $table->unique(['categoria', 'grupo', 'nombre'], 'arancel_internacion_unico');
        });

        Schema::create('internacion_aranceles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internacion_id')->constrained('internaciones')->cascadeOnDelete();
            $table->foreignId('arancel_internacion_id')->nullable()->constrained('arancel_internaciones')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('categoria', 100);
            $table->string('nombre', 180);
            $table->string('tipo_precio', 40);
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('cantidad', 10, 2)->default(1);
            $table->decimal('total', 10, 2);
            $table->dateTime('fecha_hora');
            $table->text('observacion')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['internacion_id', 'fecha_hora']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internacion_aranceles');
        Schema::dropIfExists('arancel_internaciones');
    }
};
