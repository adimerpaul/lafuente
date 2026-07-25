<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private string $marker = 'Asignación ficticia creada por migración para demostración.';

    public function up(): void
    {
        $funcionarios = DB::table('users')
            ->where('role', '!=', 'Administrador')
            ->orderBy('id')
            ->limit(6)
            ->pluck('id');

        if ($funcionarios->isEmpty()) {
            return;
        }

        $asignadorId = DB::table('users')
            ->where('role', 'Administrador')
            ->orderBy('id')
            ->value('id');

        $activos = DB::table('activos_fijos')
            ->where('codigo', 'like', 'DEMO-AF-%')
            ->orderBy('codigo')
            ->get(['id']);

        foreach ($activos as $index => $activo) {
            $tieneAsignacion = DB::table('activo_fijo_asignaciones')
                ->where('activo_fijo_id', $activo->id)
                ->where('estado', 'Asignado')
                ->exists();

            if ($tieneAsignacion) {
                continue;
            }

            DB::table('activo_fijo_asignaciones')->insert([
                'activo_fijo_id' => $activo->id,
                'user_id' => $funcionarios[$index % $funcionarios->count()],
                'asignado_por' => $asignadorId,
                'fecha_asignacion' => now()->subDays(($index + 1) * 3)->setTime(9, 0),
                'estado' => 'Asignado',
                'observacion' => $this->marker,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('activo_fijo_asignaciones')
            ->where('observacion', $this->marker)
            ->delete();
    }
};
