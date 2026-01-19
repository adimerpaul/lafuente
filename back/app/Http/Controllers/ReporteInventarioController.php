<?php

namespace App\Http\Controllers;

use App\Models\CompraDetalle;
use Carbon\Carbon;
use Illuminate\Http\Request;
use PDF;

class ReporteInventarioController extends Controller
{
    public function inventarioInicialMedicamentosPdf(Request $request)
    {
        @ini_set('memory_limit', '1024M');
        @set_time_limit(180);

        $user = $request->user();
        $now  = Carbon::now();

        // 1 fila por producto/proveedor (comprimido)
        // IMPORTANTE: vencimiento ya viene formateado (no Carbon por fila)
        $rows = CompraDetalle::query()
            ->from('compra_detalles as cd')
            ->join('compras as c', 'c.id', '=', 'cd.compra_id')
            ->leftJoin('productos as p', 'p.id', '=', 'cd.producto_id')
            ->leftJoin('proveedores as prov', 'prov.id', '=', 'cd.proveedor_id')
            ->where('cd.estado', 'Activo')
            ->where('cd.cantidad_venta', '>', 0)
            ->whereNull('c.deleted_at')
            ->where('c.estado', '!=', 'Anulado')
            ->selectRaw("
                cd.producto_id,
                cd.proveedor_id,

                COALESCE(p.nombre, cd.nombre) as producto,
                COALESCE(p.descripcion, '') as dci,
                COALESCE(p.unidad, '') as presentacion,
                COALESCE(prov.nombre, '') as laboratorio,

                MIN(cd.fecha_vencimiento) as vencimiento_raw,
                DATE_FORMAT(MIN(cd.fecha_vencimiento), '%d/%m/%Y') as vencimiento,

                SUM(cd.cantidad_venta) as cant,

                ROUND(
                    SUM(cd.cantidad_venta * cd.precio) / NULLIF(SUM(cd.cantidad_venta), 0),
                2) as p_compra,

                ROUND(
                    SUM(cd.cantidad_venta * COALESCE(cd.precio_venta, 0)) / NULLIF(SUM(cd.cantidad_venta), 0),
                2) as p_venta,

                SUM(cd.cantidad_venta * cd.precio) as total
            ")
            ->groupBy([
                'cd.producto_id',
                'cd.proveedor_id',
                'p.nombre','p.descripcion','p.unidad',
                'cd.nombre',
                'prov.nombre',
            ])
            ->orderByRaw("CASE WHEN MIN(cd.fecha_vencimiento) IS NULL THEN 1 ELSE 0 END")
            ->orderByRaw("MIN(cd.fecha_vencimiento)")
            ->get();

        // Fix para fechas raras tipo 0026-04-01 (solo si aparece)
        $rows->transform(function ($r) {
            if (!empty($r->vencimiento_raw) && preg_match('/^0{2,3}\d{1}-\d{2}-\d{2}$/', $r->vencimiento_raw)) {
                $fixed = '20' . substr($r->vencimiento_raw, 2);
                $r->vencimiento = substr($fixed, 8, 2) . '/' . substr($fixed, 5, 2) . '/' . substr($fixed, 0, 4);
            }
            if (empty($r->vencimiento_raw)) $r->vencimiento = '';
            return $r;
        });

        $sumCantidad = (float) $rows->sum('cant');
        $sumTotal    = (float) $rows->sum('total');

        $logoPath = public_path('logo.png');
        $logoBase64 = null;
        if (is_file($logoPath)) {
            $type = pathinfo($logoPath, PATHINFO_EXTENSION);
            $data = file_get_contents($logoPath);
            $logoBase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        $pdf = PDF::loadView('reportes.inventario_inicial_medicamentos', [
            'rows' => $rows,
            'sumCantidad' => $sumCantidad,
            'sumTotal' => $sumTotal,
            'user' => $user,
            'now' => $now,
            'logoBase64' => $logoBase64,
        ]);

        // Opciones que ayudan al rendimiento
        $pdf->setPaper('letter', 'landscape'); // 🔥 baja páginas fuerte

        return $pdf->stream('inventario_inicial_medicamentos.pdf');
    }
}
