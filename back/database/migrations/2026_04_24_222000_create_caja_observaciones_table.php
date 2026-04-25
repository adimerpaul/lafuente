<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCajaObservacionesTable extends Migration
{
    public function up()
    {
        Schema::create('caja_observaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caja_recepcion_id')->constrained('caja_recepciones')->cascadeOnDelete();
            $table->string('tipo'); // atención_médica, curación, sutura, etc.
            $table->text('observacion')->nullable();
            $table->string('foto_path')->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('caja_observaciones');
    }
}
