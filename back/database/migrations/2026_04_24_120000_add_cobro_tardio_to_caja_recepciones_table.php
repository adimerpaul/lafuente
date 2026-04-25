<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('caja_recepciones', function (Blueprint $table) {
            $table->dateTime('fecha_cobro')->nullable()->after('estado_cobro');
            $table->unsignedBigInteger('cobrado_por_user_id')->nullable()->after('fecha_cobro');
            $table->foreign('cobrado_por_user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::table('caja_recepciones', function (Blueprint $table) {
            $table->dropForeign(['cobrado_por_user_id']);
            $table->dropColumn(['fecha_cobro', 'cobrado_por_user_id']);
        });
    }
};
