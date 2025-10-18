<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Venta;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $desde = $request->input('desde');
        $hasta = $request->input('hasta');

        // Defaults: mes actual [YYYY-MM-01 .. YYYY-MM-DD]
        if (!$desde || !$hasta) {
            $desde = now()->startOfMonth()->toDateString();
            $hasta = now()->toDateString();
        }

        // Últimas ventas ACTIVAS en el rango
        $ventas = Venta::with('doctor')
            ->where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->take(10)
            ->get();

        // KPIs: solo ventas ACTIVAS
        $totales = Venta::selectRaw("
                SUM(CASE WHEN tipo_venta='Interno' THEN total ELSE 0 END) as interno,
                SUM(CASE WHEN tipo_venta='Externo' THEN total ELSE 0 END) as externo
            ")
            ->where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->first();

        // Ventas diarias (solo ACTIVAS)
        $ventasPorDia = Venta::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->selectRaw('DATE(fecha) as dia, SUM(total) as total')
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();

        $dias = $ventasPorDia->pluck('dia');
        $ventasDiarias = $ventasPorDia->pluck('total');

        // Series mensuales del AÑO ACTUAL (solo ACTIVAS)
        $anio = now()->year;

        $ventasMesRaw = Venta::where('estado', 'Activo')
            ->whereYear('fecha', $anio)
            ->selectRaw('MONTH(fecha) as m, SUM(total) as total')
            ->groupBy('m')
            ->pluck('total', 'm');

        // Para compras, si también manejas anuladas, filtra por estado
        $comprasMesRaw = Compra::where('estado', 'Activo')
            ->whereYear('fecha', $anio)
            ->selectRaw('MONTH(fecha) as m, SUM(total) as total')
            ->groupBy('m')
            ->pluck('total', 'm');

        $meses = [];
        $ventasMes = [];
        $comprasMes = [];
        for ($m = 1; $m <= 12; $m++) {
            $meses[]      = date('M', mktime(0, 0, 0, $m, 1));
            $ventasMes[]  = (float) ($ventasMesRaw[$m] ?? 0);
            $comprasMes[] = (float) ($comprasMesRaw[$m] ?? 0);
        }

        // Utilidad en el rango (solo ACTIVAS)
        $ventasTotalRango  = (float) Venta::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->sum('total');

        $comprasTotalRango = (float) Compra::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->sum('total');

        $utilidad = $ventasTotalRango - $comprasTotalRango;

        return response()->json([
            'ventas'         => $ventas,
            'totales'        => [
                'interno' => (float) ($totales->interno ?? 0),
                'externo' => (float) ($totales->externo ?? 0)
            ],
            'utilidad'       => $utilidad,

            // bar: ventas diarias
            'dias'           => $dias,
            'ventasDiarias'  => $ventasDiarias,

            // line: compras vs ventas (año)
            'meses'          => $meses,
            'ventasMes'      => $ventasMes,
            'comprasMes'     => $comprasMes,

            // eco del rango
            'desde'          => $desde,
            'hasta'          => $hasta,
        ]);
    }
}
