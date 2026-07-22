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
        Schema::table('ventas', function (Blueprint $table) {
            $table->unsignedBigInteger('paciente_id_ref')->nullable()->after('cliente_id');
            // Opcional: si quieres FK real (asegúrate nombre de tabla/PK)
            // $table->foreign('paciente_id_ref')->references('id')->on('pacientes')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            // $table->dropForeign(['paciente_id_ref']);
            $table->dropColumn('paciente_id_ref');
        });
    }
};
