<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reporte de Caja Recepcion</title>
    <style>
        @page {
            size: letter landscape;
            margin: 22px 18px;
        }

        * {
            box-sizing: border-box;
            font-family: DejaVu Sans, Arial, Helvetica, sans-serif;
        }

        body {
            margin: 0;
            color: #111827;
            font-size: 10px;
            line-height: 1.05;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid #0ea5e9;
            padding-bottom: 6px;
            margin-bottom: 6px;
        }

        .brand {
            font-weight: 800;
            color: #0ea5e9;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .title {
            font-size: 13px;
            font-weight: 900;
            color: #0ea5e9;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .meta {
            font-size: 9px;
            text-align: right;
        }

        .filters {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            background: #f0f9ff;
            border: 1px solid #cce7f6;
            padding: 6px 8px;
            margin-bottom: 6px;
            border-radius: 6px;
        }

        .filters b {
            font-weight: 800;
        }

        .muted {
            color: #6b7280;
            font-size: 9px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        th {
            background: #e2e8f0;
            border: 1px solid #94a3b8;
            padding: 3px 2px;
            font-size: 8px;
            text-align: center;
            font-weight: 800;
        }

        td {
            border: 1px solid #cbd5e1;
            padding: 2px 3px;
            font-size: 7.5px;
            vertical-align: middle;
        }

        .right { text-align: right; }
        .center { text-align: center; }
        .anulado { background: #fef2f2; color: #991b1b; }
        .totals {
            margin-top: 8px;
            width: 38%;
            margin-left: auto;
            border-top: 2px solid #0ea5e9;
            padding-top: 6px;
        }

        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 2px 0;
            font-size: 10px;
        }

        .totals-row strong {
            font-weight: 900;
        }
    </style>
</head>
<body>
<div class="header">
    <div class="brand">
        <img src="{{ public_path('logo.jpg') }}" alt="CLINICA LA FUENTE" style="height:28px;">
        <div>CLINICA LA FUENTE</div>
    </div>
    <div class="title">Reporte de Caja Recepcion</div>
    <div class="meta">
        <div><b>Fecha:</b> {{ $hoy->format('d/m/Y') }}</div>
        <div><b>Hora:</b> {{ $hoy->format('H:i') }}</div>
    </div>
</div>

<div class="filters">
    <div>
        <b>Rango:</b> {{ $fechaInicio ?: '—' }} al {{ $fechaFin ?: '—' }}
        &nbsp;&nbsp; <b>Usuario:</b> {{ $userLabel ?: 'Todos' }}
        &nbsp;&nbsp; <b>Buscar:</b> {{ $search ?: '—' }}
    </div>
    <div class="muted">
        <b>Registros:</b> {{ $items->count() }}
    </div>
</div>

<table>
    <thead>
    <tr>
        <th style="width: 26px;">N°</th>
        <th style="width: 44px;">Estado</th>
        <th style="width: 54px;">Fecha</th>
        <th style="width: 34px;">Hora</th>
        <th style="width: 72px;">Usuario</th>
        <th style="width: 44px;">Mov.</th>
        <th style="width: 44px;">Doc.</th>
        <th style="width: 48px;">N° Fact.</th>
        <th style="width: 40px;">Ficha</th>
        <th style="width: 88px;">Medico</th>
        <th style="width: 110px;">Paciente</th>
        <th style="width: 42px;">At. Med.</th>
        <th style="width: 42px;">Curac.</th>
        <th style="width: 42px;">Inyect.</th>
        <th style="width: 42px;">T. Pres.</th>
        <th style="width: 42px;">Ambul.</th>
        <th style="width: 42px;">Lab.</th>
        <th style="width: 42px;">Ecogr.</th>
        <th style="width: 46px;">Uso Cons.</th>
        <th style="width: 42px;">Glic.</th>
        <th style="width: 46px;">Cert.</th>
        <th style="width: 42px;">Sutura</th>
        <th style="width: 46px;">Antis.</th>
        <th style="width: 42px;">Cama</th>
        <th style="width: 46px;">Comp.</th>
        <th style="width: 46px;">Uso Eco.</th>
        <th style="width: 46px;">Flebot.</th>
        <th style="width: 42px;">Sonda</th>
        <th style="width: 48px;">Farm.</th>
        <th style="width: 52px;">Recaud.</th>
        <th style="width: 42px;">Egreso</th>
        <th style="width: 40px;">QR</th>
        <th style="width: 48px;">Efect.</th>
    </tr>
    </thead>
    <tbody>
    @forelse($items as $index => $item)
        <tr class="{{ $item->estado === 'Anulado' ? 'anulado' : '' }}">
            <td class="center">{{ $index + 1 }}</td>
            <td class="center">{{ $item->estado_label }}</td>
            <td class="center">{{ $item->fecha }}</td>
            <td class="center">{{ $item->hora ?: substr((string) $item->created_at, 11, 5) }}</td>
            <td>{{ optional($item->user)->name ?: '—' }}</td>
            <td class="center">{{ $item->tipo_movimiento ?: '—' }}</td>
            <td class="center">{{ $item->documento_label }}</td>
            <td class="center">{{ $item->nombre_factura ?: '—' }}</td>
            <td class="center">{{ $item->numero_ficha ?: '—' }}</td>
            <td>{{ optional($item->doctor)->nombre ?: '—' }}</td>
            <td>{{ optional($item->paciente)->nombre_completo ?: '—' }}</td>
            <td class="right">{{ number_format((float) $item->costo_atencion_medica, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_curacion, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_inyectable, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_toma_presion, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_ambulancia, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_laboratorio, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_ecografia, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_uso_consultorio, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_glicemia, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_certificado_medico, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_sutura, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_antisepticos, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_cama, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_compania_noche, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_uso_ecografia, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_flebotomia, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_sonda, 2) }}</td>
            <td class="right">{{ number_format((float) $item->costo_farmacia, 2) }}</td>
            <td class="right">{{ number_format((float) $item->recaudado_total, 2) }}</td>
            <td class="right">{{ number_format((float) $item->egreso, 2) }}</td>
            <td class="right">{{ number_format((float) $item->qr, 2) }}</td>
            <td class="right">{{ number_format((float) $item->efectivo, 2) }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="33" class="center">No hay registros para los filtros seleccionados.</td>
        </tr>
    @endforelse
    </tbody>
</table>

<div class="totals">
    <div class="totals-row"><span>Total recaudado:</span> <strong>{{ number_format((float) $summary['total_recaudado'], 2) }}</strong></div>
    <div class="totals-row"><span>Menos egresos:</span> <strong>{{ number_format((float) $summary['total_egresos'], 2) }}</strong></div>
    <div class="totals-row"><span>Menos farmacia:</span> <strong>{{ number_format((float) $summary['total_farmacia'], 2) }}</strong></div>
    <div class="totals-row"><span>Saldo:</span> <strong>{{ number_format((float) $summary['saldo'], 2) }}</strong></div>
    <div class="totals-row"><span>Menos QR:</span> <strong>{{ number_format((float) $summary['total_qr'], 2) }}</strong></div>
    <div class="totals-row"><span>Saldo final en efectivo:</span> <strong>{{ number_format((float) $summary['saldo_final_efectivo'], 2) }}</strong></div>
</div>
</body>
</html>
