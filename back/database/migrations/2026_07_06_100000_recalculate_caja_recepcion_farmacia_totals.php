<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $ids = DB::table('caja_recepcion_costos')->distinct()->pluck('caja_recepcion_id');

        foreach ($ids as $id) {
            $record = DB::table('caja_recepciones')->where('id', $id)->first();
            if (! $record) {
                continue;
            }

            $newTotal = (float) DB::table('caja_recepcion_costos')
                ->where('caja_recepcion_id', $id)
                ->whereRaw('LOWER(TRIM(nombre)) != ?', ['farmacia'])
                ->sum('monto');

            $oldTotal = (float) $record->recaudado_total;
            $diff = round($oldTotal - $newTotal, 2);

            if ($diff <= 0) {
                continue;
            }

            $efectivo = (float) $record->efectivo;
            $qr = (float) $record->qr;

            if ($efectivo >= $diff) {
                $efectivo -= $diff;
            } else {
                $remaining = $diff - $efectivo;
                $efectivo = 0;
                $qr = max(0, $qr - $remaining);
            }

            DB::table('caja_recepciones')
                ->where('id', $id)
                ->update([
                    'recaudado_total' => $newTotal,
                    'efectivo' => $efectivo,
                    'qr' => $qr,
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        // Ajuste de datos historico: el monto de Farmacia dejo de sumarse al total,
        // no es posible recuperar de forma fiable los valores previos de efectivo/qr.
    }
};
