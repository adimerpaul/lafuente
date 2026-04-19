<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('fecha_creacion')->constrained('users')->nullOnDelete();
            $table->string('estado_internacion')->default('No internado')->after('user_id');
            $table->timestamp('fecha_alta')->nullable()->after('estado_internacion');
            $table->foreignId('alta_user_id')->nullable()->after('fecha_alta')->constrained('users')->nullOnDelete();
        });

        DB::table('pacientes')
            ->where('tipo_paciente', 'Interno')
            ->update(['estado_internacion' => 'Internado']);
    }

    public function down(): void
    {
        Schema::table('pacientes', function (Blueprint $table) {
            $table->dropConstrainedForeignId('alta_user_id');
            $table->dropColumn('fecha_alta');
            $table->dropColumn('estado_internacion');
            $table->dropConstrainedForeignId('user_id');
        });
    }
};
