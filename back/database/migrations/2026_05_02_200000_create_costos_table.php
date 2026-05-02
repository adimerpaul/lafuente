<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('costos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('categoria')->nullable();
            $table->string('icono')->default('payments');
            $table->string('color')->default('primary');
            $table->boolean('activo')->default(true);
            $table->unsignedInteger('orden')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('costo_arancel', function (Blueprint $table) {
            $table->id();
            $table->foreignId('costo_id')->constrained('costos')->onDelete('cascade');
            $table->foreignId('arancel_id')->constrained('aranceles')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('caja_recepcion_costos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caja_recepcion_id')->constrained('caja_recepciones')->onDelete('cascade');
            $table->foreignId('costo_id')->nullable()->constrained('costos')->onDelete('set null');
            $table->string('nombre');
            $table->decimal('monto', 10, 2)->default(0);
            $table->json('arancel_ids')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('caja_recepcion_costos');
        Schema::dropIfExists('costo_arancel');
        Schema::dropIfExists('costos');
    }
};
