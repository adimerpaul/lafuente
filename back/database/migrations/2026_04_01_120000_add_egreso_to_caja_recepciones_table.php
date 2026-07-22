<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('caja_recepciones', function (Blueprint $table) {
            $table->decimal('egreso', 10, 2)->default(0)->after('efectivo');
        });
    }

    public function down(): void
    {
        Schema::table('caja_recepciones', function (Blueprint $table) {
            $table->dropColumn('egreso');
        });
    }
};
