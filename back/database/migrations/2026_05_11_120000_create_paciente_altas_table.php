<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paciente_altas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('accion');
            $table->string('estado_anterior')->nullable();
            $table->string('estado_nuevo')->nullable();
            $table->timestamp('fecha_hora');
            $table->timestamps();
        });

        $altas = DB::table('pacientes')
            ->whereNotNull('fecha_alta')
            ->get(['id', 'alta_user_id', 'estado_internacion', 'fecha_alta', 'created_at', 'updated_at']);

        foreach ($altas as $alta) {
            DB::table('paciente_altas')->insert([
                'paciente_id' => $alta->id,
                'user_id' => $alta->alta_user_id,
                'accion' => 'Alta',
                'estado_anterior' => 'Internado',
                'estado_nuevo' => $alta->estado_internacion ?: 'Alta',
                'fecha_hora' => $alta->fecha_alta,
                'created_at' => $alta->created_at,
                'updated_at' => $alta->updated_at,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('paciente_altas');
    }
};
