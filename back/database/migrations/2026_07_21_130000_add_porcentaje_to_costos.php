<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('costos', function (Blueprint $table) {
            $table->decimal('porcentaje', 5, 2)->default(0)->after('orden');
        });
    }

    public function down(): void
    {
        Schema::table('costos', function (Blueprint $table) {
            $table->dropColumn('porcentaje');
        });
    }
};
