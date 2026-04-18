<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Agregar campo tipo a compras (para identificar si es compra normal o traspaso)
        Schema::table('compras', function (Blueprint $table) {
            $table->string('tipo')->default('Compra')->after('nro_factura')->index();
            // Agregar referencia a la compra/venta relacionada en caso de traspaso
            $table->unsignedBigInteger('traspaso_venta_id')->nullable()->after('tipo')->index();
        });

        // Agregar campo tipo a ventas (para identificar si es venta normal o traspaso)
        Schema::table('ventas', function (Blueprint $table) {
            $table->string('tipo')->default('Venta')->after('pagado_interno')->index();
            // Agregar referencia a la compra relacionada en caso de traspaso
            $table->unsignedBigInteger('traspaso_compra_id')->nullable()->after('tipo')->index();
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex(['traspaso_compra_id']);
            $table->dropColumn('traspaso_compra_id');
            $table->dropIndex(['tipo']);
            $table->dropColumn('tipo');
        });

        Schema::table('compras', function (Blueprint $table) {
            $table->dropIndex(['traspaso_venta_id']);
            $table->dropColumn('traspaso_venta_id');
            $table->dropIndex(['tipo']);
            $table->dropColumn('tipo');
        });
    }
};
