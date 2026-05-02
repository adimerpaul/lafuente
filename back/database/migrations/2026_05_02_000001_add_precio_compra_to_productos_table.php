<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->decimal('precio_compra', 10, 2)->nullable()->after('precio');
        });

        // Backfill: último precio de compra activo por producto
        DB::statement("
            UPDATE productos p
            JOIN (
                SELECT cd.producto_id, cd.precio
                FROM compra_detalles cd
                JOIN compras c ON c.id = cd.compra_id
                WHERE cd.estado = 'Activo'
                  AND c.estado  = 'Activo'
                  AND cd.deleted_at IS NULL
                  AND c.deleted_at  IS NULL
                ORDER BY c.fecha DESC, cd.id DESC
            ) last_cd ON last_cd.producto_id = p.id
            SET p.precio_compra = last_cd.precio
            WHERE p.deleted_at IS NULL
        ");
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn('precio_compra');
        });
    }
};
