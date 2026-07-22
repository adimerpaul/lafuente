<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('caja_recepciones', function (Blueprint $table) {
            $table->string('estado')->default('Activo')->after('numero_ficha');
        });

        DB::table('caja_recepciones')
            ->whereNotNull('deleted_at')
            ->update([
                'estado' => 'Anulado',
                'deleted_at' => null,
            ]);
    }

    public function down(): void
    {
        Schema::table('caja_recepciones', function (Blueprint $table) {
            $table->dropColumn('estado');
        });
    }
};
