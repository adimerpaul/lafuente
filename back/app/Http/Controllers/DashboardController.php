<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        // ==========================
        // ÚLTIMAS VENTAS (ACTIVAS)
        // ==========================
        $ventas = Venta::with(['doctor', 'user'])
            ->where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->orderByDesc('fecha')
            ->orderByDesc('hora')
            ->orderByDesc('id')
            ->take(10)
            ->get()
            // normaliza el texto (si te quedó "Interno" antiguo)
            ->map(function ($v) {
                if (($v->tipo_venta ?? '') === 'Interno') $v->tipo_venta = 'Internado';
                return $v;
            });

        // ==========================
        // KPIs (solo ACTIVAS)
        // Internado = Internado o Interno (legacy)
        // ==========================
        $totales = Venta::selectRaw("
                SUM(CASE WHEN tipo_venta IN ('Internado','Interno') THEN total ELSE 0 END) as internado,
                SUM(CASE WHEN tipo_venta='Externo' THEN total ELSE 0 END) as externo
            ")
            ->where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->first();

        // ==========================
        // Ventas diarias (solo ACTIVAS)
        // ==========================
        $ventasPorDia = Venta::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->selectRaw('DATE(fecha) as dia, SUM(total) as total')
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();

        $dias = $ventasPorDia->pluck('dia');
        $ventasDiarias = $ventasPorDia->pluck('total');

        // ==========================
        // Series mensuales del AÑO ACTUAL
        // ==========================
        $anio = now()->year;

        $ventasMesRaw = Venta::where('estado', 'Activo')
            ->whereYear('fecha', $anio)
            ->selectRaw('MONTH(fecha) as m, SUM(total) as total')
            ->groupBy('m')
            ->pluck('total', 'm');

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

        // ==========================
        // Utilidad en el rango
        // ==========================
        $ventasTotalRango  = (float) Venta::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->sum('total');

        $comprasTotalRango = (float) Compra::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->sum('total');

        $utilidad = $ventasTotalRango - $comprasTotalRango;

        // ==========================
        // Ventas por usuario (rango)
        // ==========================
        $ventasPorUsuario = Venta::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->join('users', 'users.id', '=', 'ventas.user_id')
            ->selectRaw("users.name as usuario, SUM(ventas.total) as total")
            ->groupBy('users.name')
            ->orderByDesc('total')
            ->limit(12)
            ->get();

        $usuarios = $ventasPorUsuario->pluck('usuario');
        $ventasUsuarios = $ventasPorUsuario->pluck('total');

        return response()->json([
            'ventas' => $ventas,

            'totales' => [
                'internado' => (float) ($totales->internado ?? 0),
                'externo'   => (float) ($totales->externo ?? 0),
            ],

            'utilidad' => (float) $utilidad,

            // bar: ventas diarias
            'dias'          => $dias,
            'ventasDiarias' => $ventasDiarias,

            // line: compras vs ventas (año)
            'meses'      => $meses,
            'ventasMes'  => $ventasMes,
            'comprasMes' => $comprasMes,

            // bar: ventas por usuario (rango)
            'usuarios'       => $usuarios,
            'ventasUsuarios' => $ventasUsuarios,

            'desde' => $desde,
            'hasta' => $hasta,
        ]);
    }
}
