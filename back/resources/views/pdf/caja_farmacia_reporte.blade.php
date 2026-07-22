<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reporte de Farmacia - Caja Recepcion</title>
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
            border-bottom: 2px solid #f97316;
            padding-bottom: 6px;
            margin-bottom: 6px;
        }

        .brand {
            font-weight: 800;
            color: #f97316;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .title {
            font-size: 13px;
            font-weight: 900;
            color: #f97316;
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
            background: #fff7ed;
            border: 1px solid #fed7aa;
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
            border-top: 2px solid #f97316;
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
    <div class="title">Reporte de Farmacia</div>
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
        <th style="width: 60px;">Fecha</th>
        <th style="width: 40px;">Hora</th>
        <th style="width: 60px;">Ficha</th>
        <th style="width: 70px;">N° Fact.</th>
        <th>Paciente</th>
        <th>Encargado</th>
        <th style="width: 70px;">Monto Farmacia</th>
    </tr>
    </thead>
    <tbody>
    @forelse($items as $index => $item)
        <tr>
            <td class="center">{{ $index + 1 }}</td>
            <td class="center">{{ $item->fecha }}</td>
            <td class="center">{{ $item->hora ?: substr((string) $item->created_at, 11, 5) }}</td>
            <td class="center">{{ $item->numero_ficha ?: '—' }}</td>
            <td class="center">{{ $item->nombre_factura ?: '—' }}</td>
            <td>{{ optional($item->paciente)->nombre_completo ?: '—' }}</td>
            <td>{{ optional($item->user)->name ?: '—' }}</td>
            <td class="right">{{ number_format((float) $item->costo_farmacia, 2) }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="8" class="center">No hay registros de farmacia para los filtros seleccionados.</td>
        </tr>
    @endforelse
    </tbody>
</table>

<div class="totals">
    <div class="totals-row"><span>Total farmacia:</span> <strong>{{ number_format((float) $totalFarmacia, 2) }}</strong></div>
</div>
</body>
</html>
