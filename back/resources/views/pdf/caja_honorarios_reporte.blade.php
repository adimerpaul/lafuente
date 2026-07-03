<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reporte de Honorarios de Doctor - Caja Recepcion</title>
    <style>
        @page {
            size: letter portrait;
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
            line-height: 1.1;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid #6366f1;
            padding-bottom: 6px;
            margin-bottom: 6px;
        }

        .brand {
            font-weight: 800;
            color: #6366f1;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .title {
            font-size: 13px;
            font-weight: 900;
            color: #6366f1;
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
            background: #eef2ff;
            border: 1px solid #c7d2fe;
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

        .section-title {
            font-size: 11px;
            font-weight: 900;
            color: #6366f1;
            text-transform: uppercase;
            margin: 10px 0 4px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        th {
            background: #e2e8f0;
            border: 1px solid #94a3b8;
            padding: 4px 3px;
            font-size: 8.5px;
            text-align: center;
            font-weight: 800;
        }

        td {
            border: 1px solid #cbd5e1;
            padding: 3px 4px;
            font-size: 8.5px;
            vertical-align: middle;
        }

        .right { text-align: right; }
        .center { text-align: center; }

        .totals {
            margin-top: 10px;
            width: 45%;
            margin-left: auto;
            border-top: 2px solid #6366f1;
            padding-top: 6px;
        }

        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            font-size: 11px;
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
    <div class="title">Reporte de Honorarios de Doctor</div>
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

<div class="section-title">Resumen por doctor</div>
<table>
    <thead>
    <tr>
        <th>Doctor</th>
        <th style="width: 70px;">Atenciones</th>
        <th style="width: 90px;">Honorario</th>
    </tr>
    </thead>
    <tbody>
    @forelse($porDoctor as $row)
        <tr>
            <td>{{ $row['doctor'] }}</td>
            <td class="center">{{ $row['cantidad'] }}</td>
            <td class="right">{{ number_format((float) $row['monto'], 2) }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="3" class="center">No hay honorarios para los filtros seleccionados.</td>
        </tr>
    @endforelse
    </tbody>
</table>

<div class="section-title">Detalle</div>
<table>
    <thead>
    <tr>
        <th style="width: 26px;">N°</th>
        <th style="width: 60px;">Fecha</th>
        <th style="width: 60px;">Ficha</th>
        <th>Paciente</th>
        <th>Doctor</th>
        <th style="width: 70px;">Honorario</th>
    </tr>
    </thead>
    <tbody>
    @forelse($items as $index => $item)
        <tr>
            <td class="center">{{ $index + 1 }}</td>
            <td class="center">{{ $item->fecha }}</td>
            <td class="center">{{ $item->numero_ficha ?: '—' }}</td>
            <td>{{ optional($item->paciente)->nombre_completo ?: '—' }}</td>
            <td>{{ optional($item->doctor)->nombre ?: 'Sin doctor asignado' }}</td>
            <td class="right">{{ number_format((float) $item->egreso, 2) }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="6" class="center">No hay honorarios para los filtros seleccionados.</td>
        </tr>
    @endforelse
    </tbody>
</table>

<div class="totals">
    <div class="totals-row"><span>Total honorarios:</span> <strong>{{ number_format((float) $totalHonorarios, 2) }}</strong></div>
</div>
</body>
</html>
