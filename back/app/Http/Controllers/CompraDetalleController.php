<?php

namespace App\Http\Controllers;

use App\Models\CompraDetalle;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CompraDetalleController extends Controller{
    public function vencimientosCampana()
    {
        $hoy = Carbon::today();
        $limite = Carbon::today()->addDays(90);

        $productos = CompraDetalle::with('producto')
            ->whereNotNull('fecha_vencimiento')
            ->whereDate('fecha_vencimiento', '>=', $hoy)
            ->whereDate('fecha_vencimiento', '<=', $limite)
            ->orderBy('fecha_vencimiento', 'asc')
//            estado
            ->where('estado', 'Activo')
            ->get()
            ->map(function ($item) use ($hoy) {
                return [
                    'producto' => $item->producto->nombre ?? 'Sin nombre',
                    'imagen' => $item->producto->imagen ?? 'default.png',
                    'fecha_vencimiento' => $item->fecha_vencimiento,
//                    'dias_restantes' => Carbon::parse($item->fecha_vencimiento)->diffInDays($hoy), parte entera
                    'dias_restantes' => Carbon::parse($hoy)->diffInDays($item->fecha_vencimiento), // parte entera
                ];
            });

        return response()->json($productos);
    }
}
