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
            $table->string('farmacia_tipo')->default('Farmacia')->after('imagen')->index();
        });

        Schema::table('compras', function (Blueprint $table) {
            $table->string('farmacia_tipo')->default('Farmacia')->after('proveedor_id')->index();
        });

        Schema::table('compra_detalles', function (Blueprint $table) {
            $table->string('farmacia_tipo')->default('Farmacia')->after('producto_id')->index();
        });

        Schema::table('ventas', function (Blueprint $table) {
            $table->string('farmacia_tipo')->default('Farmacia')->after('paciente_id_ref')->index();
        });

        Schema::table('venta_detalles', function (Blueprint $table) {
            $table->string('farmacia_tipo')->default('Farmacia')->after('producto_id')->index();
        });

        DB::table('productos')->update(['farmacia_tipo' => 'Farmacia']);
        DB::table('compras')->update(['farmacia_tipo' => 'Farmacia']);
        DB::table('compra_detalles')->update(['farmacia_tipo' => 'Farmacia']);
        DB::table('ventas')->update(['farmacia_tipo' => 'Farmacia']);
        DB::table('venta_detalles')->update(['farmacia_tipo' => 'Farmacia']);

        $productos = DB::table('productos')
            ->whereNull('deleted_at')
            ->get([
                'nombre',
                'imagen',
                'descripcion',
                'unidad',
                'precio',
                'stock',
                'stock_minimo',
                'stock_maximo',
                'created_at',
                'updated_at',
            ]);

        $now = now();
        $clones = [];

        foreach ($productos as $producto) {
            $clones[] = [
                'nombre' => $producto->nombre,
                'imagen' => $producto->imagen,
                'farmacia_tipo' => 'Farmacia institucional',
                'descripcion' => $producto->descripcion,
                'unidad' => $producto->unidad,
                'precio' => $producto->precio,
                'stock' => $producto->stock,
                'stock_minimo' => $producto->stock_minimo,
                'stock_maximo' => $producto->stock_maximo,
                'created_at' => $producto->created_at ?? $now,
                'updated_at' => $producto->updated_at ?? $now,
            ];
        }

        foreach (array_chunk($clones, 500) as $chunk) {
            DB::table('productos')->insert($chunk);
        }
    }

    public function down(): void
    {
        DB::table('productos')
            ->where('farmacia_tipo', 'Farmacia institucional')
            ->whereNull('deleted_at')
            ->delete();

        Schema::table('venta_detalles', function (Blueprint $table) {
            $table->dropIndex(['farmacia_tipo']);
            $table->dropColumn('farmacia_tipo');
        });

        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex(['farmacia_tipo']);
            $table->dropColumn('farmacia_tipo');
        });

        Schema::table('compra_detalles', function (Blueprint $table) {
            $table->dropIndex(['farmacia_tipo']);
            $table->dropColumn('farmacia_tipo');
        });

        Schema::table('compras', function (Blueprint $table) {
            $table->dropIndex(['farmacia_tipo']);
            $table->dropColumn('farmacia_tipo');
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex(['farmacia_tipo']);
            $table->dropColumn('farmacia_tipo');
        });
    }
};
