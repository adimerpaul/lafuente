<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('caja_recepcion_costos', function (Blueprint $table) {
            $table->boolean('pagado')->default(false)->after('arancel_ids');
            $table->timestamp('pagado_at')->nullable()->after('pagado');
            $table->foreignId('pagado_por_user_id')->nullable()->after('pagado_at')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('caja_recepcion_costos', function (Blueprint $table) {
            $table->dropConstrainedForeignId('pagado_por_user_id');
            $table->dropColumn(['pagado', 'pagado_at']);
        });
    }
};
