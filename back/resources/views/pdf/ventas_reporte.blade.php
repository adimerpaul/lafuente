<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>{{ $titulo }}</title>
    <style>
        @page {
            size: letter;
            margin: 30px 30px;
        }

        * {
            box-sizing: border-box;
            font-family: DejaVu Sans, Arial, Helvetica, sans-serif;
        }

        body {
            margin: 0;
            color: #111827;
            font-size: 12px;
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
            letter-spacing: 0.6px;
        }

        .meta {
            font-size: 9px;
            color: #111827;
            text-align: right;
        }

        .summary {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            background: #f0f9ff;
            border: 1px solid #cce7f6;
            padding: 6px 6px;
            margin-bottom: 6px;
            border-radius: 6px;
        }

        .summary .left b,
        .summary .right b {
            font-weight: 800;
        }

        .summary-blocks {
            margin-bottom: 6px;
        }

        .summary-blocks table {
            width: 100%;
            border-collapse: collapse;
        }

        .summary-blocks th,
        .summary-blocks td {
            border: 1px solid #dbeafe;
            padding: 4px 5px;
            font-size: 9px;
        }

        .summary-blocks th {
            background: #eff6ff;
            text-align: center;
            font-weight: 800;
        }

        .summary-blocks td {
            text-align: right;
        }

        .summary-blocks td.label {
            text-align: left;
            font-weight: 700;
            background: #f8fafc;
        }

        .muted {
            color: #6b7280;
            font-size: 9px;
        }

        .venta {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
        }

        .venta .vhead td {
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            padding: 4px 5px;
            font-size: 9px;
        }

        .venta th {
            background: #e2e8f0;
            border: 1px solid #cbd5e1;
            padding: 3px 4px;
            font-size: 9px;
            text-align: center;
            font-weight: 800;
        }

        .venta td {
            border: 1px solid #e5e7eb;
            padding: 3px 4px;
            font-size: 9px;
            vertical-align: top;
        }

        .right {
            text-align: right;
        }

        .center {
            text-align: center;
        }

        .total td {
            background: #f8fafc;
            font-weight: 900;
        }

        .grand {
            margin-top: 6px;
            display: flex;
            justify-content: flex-end;
            font-size: 10px;
            font-weight: 900;
            padding-top: 6px;
            border-top: 2px solid #0ea5e9;
        }

        .nowrap {
            white-space: nowrap;
        }
    </style>
</head>
<body>
<div class="header">
    <div class="brand">
        <img src="{{ public_path('logo.jpg') }}" alt="CLÍNICA LA FUENTE" style="height:28px;">
        <div>CLÍNICA LA FUENTE</div>
    </div>
    <div class="title">{{ $titulo }}</div>
    <div class="meta">
        <div><b>Fecha:</b> {{ $hoy->format('d/m/Y') }}</div>
        <div><b>Hora:</b> {{ $hoy->format('H:i') }}</div>
    </div>
</div>

<div class="summary">
    <div class="left">
        <b>RANGO:</b> {{ $fechaInicio ?: '—' }} al {{ $fechaFin ?: '—' }}
        &nbsp;&nbsp; <b>USUARIO:</b> {{ $userLabel ?: 'Todos' }}
        &nbsp;&nbsp; <b>TIPO:</b> {{ $tipoVenta ?: 'Todos' }}
    </div>
    <div class="right muted">
        <b>Ventas:</b> {{ $ventas->count() }}
        &nbsp;&nbsp; <b>Total:</b> {{ number_format((float)$totalGeneral, 2) }} Bs
    </div>
</div>

<div class="summary-blocks">
    <table>
        <tr>
            <th>Resumen</th>
            <th>Internado</th>
            <th>Externo</th>
            <th>Total</th>
        </tr>
        <tr>
            <td class="label">QR</td>
            <td>{{ number_format((float) $totalQrInternado, 2) }} Bs</td>
            <td>{{ number_format((float) $totalQrExterno, 2) }} Bs</td>
            <td>{{ number_format((float) ($totalQrInternado + $totalQrExterno), 2) }} Bs</td>
        </tr>
        <tr>
            <td class="label">Efectivo</td>
            <td>{{ number_format((float) $totalEfectivoInternado, 2) }} Bs</td>
            <td>{{ number_format((float) $totalEfectivoExterno, 2) }} Bs</td>
            <td>{{ number_format((float) ($totalEfectivoInternado + $totalEfectivoExterno), 2) }} Bs</td>
        </tr>
        <tr>
            <td class="label">Totales</td>
            <td>{{ number_format((float) $totalInternado, 2) }} Bs</td>
            <td>{{ number_format((float) $totalExterno, 2) }} Bs</td>
            <td>{{ number_format((float) $totalGeneral, 2) }} Bs</td>
        </tr>
    </table>
</div>

@forelse($ventas as $venta)
    @php
        $detalles = $venta->ventaDetalles ?? collect();
        $doctor = $venta->doctor;
        $totalVenta = is_null($venta->total)
            ? $detalles->sum(fn($d) => floatval($d->cantidad) * floatval($d->precio))
            : floatval($venta->total);
    @endphp

    <table class="venta">
        <tr class="vhead">
            <td colspan="6">
                <b>ID:</b> {{ $venta->id }}
                &nbsp; | &nbsp;
                <b>FECHA:</b> <span class="nowrap">{{ $venta->fecha }}</span>
                @if($venta->hora)
                    &nbsp;<span class="muted">({{ $venta->hora }})</span>
                @endif
                &nbsp; | &nbsp;
                <b>CLIENTE:</b> {{ $venta->nombre ?: 'SN' }}
                &nbsp; | &nbsp;
                <b>TIPO:</b> {{ $venta->tipo_venta ?: '—' }}
                &nbsp; | &nbsp;
                <b>PAGO:</b> {{ $venta->tipo_pago ?: '—' }}
                &nbsp; | &nbsp;
                <b>FACTURADO:</b> {{ $venta->facturado ? 'Sí' : 'No' }}
                @if($venta->facturado)
                    &nbsp; | &nbsp;
                    <b>NRO FACTURA:</b> {{ $venta->numero_factura ?: '—' }}
                @endif
                <br>
                <b>USUARIO:</b> {{ optional($venta->user)->name ?: '—' }}
                &nbsp; | &nbsp;
                <b>DOCTOR(A):</b> {{ $doctor?->nombre ?: '—' }}
                @if($doctor && !empty($doctor->especialidad))
                    <span class="muted">— {{ $doctor->especialidad }}</span>
                @endif
            </td>
        </tr>

        <tr>
            <th style="width:26px;">#</th>
            <th style="width:55px;">CANT.</th>
            <th>MEDICAMENTO / INSUMO</th>
            <th style="width:70px;">UNID.</th>
            <th style="width:70px;">P/U</th>
            <th style="width:78px;">IMP.</th>
        </tr>

        @forelse($detalles as $i => $d)
            @php
                $cant = floatval($d->cantidad);
                $pu   = floatval($d->precio);
                $imp  = $cant * $pu;
                $nombre = $d->producto->nombre ?? $d->nombre ?? '';
                $unidad = $d->producto->unidad ?? $d->unidad ?? '';
            @endphp
            <tr>
                <td class="center">{{ $i + 1 }}</td>
                <td class="center">{{ number_format($cant, 0) }}</td>
                <td>{{ $nombre }}</td>
                <td class="center">{{ $unidad ?: '—' }}</td>
                <td class="right">{{ number_format($pu, 2) }}</td>
                <td class="right">{{ number_format($imp, 2) }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="6" class="center muted">Sin productos</td>
            </tr>
        @endforelse

        <tr class="total">
            <td colspan="5" class="right">TOTAL VENTA</td>
            <td class="right">{{ number_format($totalVenta, 2) }}</td>
        </tr>
    </table>
@empty
    <div class="muted">No hay ventas activas para los filtros seleccionados.</div>
@endforelse

<div class="grand">
    Total general: {{ number_format((float)$totalGeneral, 2) }} Bs
    &nbsp;&nbsp; | &nbsp;&nbsp;
    Internado: {{ number_format((float)$totalInternado, 2) }} Bs
    &nbsp;&nbsp; | &nbsp;&nbsp;
    Externo: {{ number_format((float)$totalExterno, 2) }} Bs
    &nbsp;&nbsp; | &nbsp;&nbsp;
    QR: {{ number_format((float) ($totalQrInternado + $totalQrExterno), 2) }} Bs
    &nbsp;&nbsp; | &nbsp;&nbsp;
    Efectivo: {{ number_format((float) ($totalEfectivoInternado + $totalEfectivoExterno), 2) }} Bs
</div>
</body>
</html>
