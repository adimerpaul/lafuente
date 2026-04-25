<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dateTime('pagado_interno_fecha')->nullable()->after('pagado_interno');
            $table->unsignedBigInteger('pagado_interno_user_id')->nullable()->after('pagado_interno_fecha');
            $table->foreign('pagado_interno_user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropForeign(['pagado_interno_user_id']);
            $table->dropColumn(['pagado_interno_fecha', 'pagado_interno_user_id']);
        });
    }
};
