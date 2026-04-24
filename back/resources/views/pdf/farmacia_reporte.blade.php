<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>{{ $titulo }}</title>
    <style>
        @page { size: letter; margin: 28px; }
        * { font-family: DejaVu Sans, Arial, sans-serif; box-sizing: border-box; }
        body { margin: 0; color: #0f172a; font-size: 12px; }
        .head { background: #3ec6dd; color: #083344; text-align: center; padding: 8px 6px; font-weight: 800; }
        .head small { display: block; font-size: 11px; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { border: 1px solid #334155; padding: 6px 7px; }
        th { background: #e6f7fb; text-transform: uppercase; font-size: 11px; }
        .label { font-weight: 700; background: #f8fafc; }
        .sub { background: #f1f5f9; }
        .right { text-align: right; }
        .center { text-align: center; }
        .total-row td { background: #c8f0f7; font-weight: 800; }
        .green { background: #e7f6d5; font-weight: 700; }
        .meta { margin: 0 0 8px 0; font-size: 11px; }
    </style>
</head>
<body>
<div class="meta">
    <b>Farmacia:</b> {{ $farmaciaTipo }} |
    <b>Fecha:</b> {{ $hoy->format('d/m/Y H:i') }} |
    <b>Rango:</b> {{ $fechaInicio ?: '—' }} al {{ $fechaFin ?: '—' }}
</div>

<div class="head">
    RENDICION DE FARMACIA
    <small>CORRESPONDIENTE AL PERIODO SELECCIONADO</small>
</div>
<table>
    <thead>
    <tr>
        <th style="width:22%">Concepto</th>
        <th>Pacientes</th>
        <th style="width:23%">Precio de venta</th>
        <th style="width:18%">Total</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="label">INGRESOS</td>
        <td class="sub">PACIENTES INTERNADOS</td>
        <td class="right green">{{ number_format((float)$internado, 2) }}</td>
        <td class="right">{{ number_format((float)$ingresos, 2) }}</td>
    </tr>
    <tr>
        <td></td>
        <td class="sub">PACIENTES INTERNOS</td>
        <td class="right">{{ number_format((float)$interno, 2) }}</td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td class="sub">PACIENTES EXTERNOS</td>
        <td class="right green">{{ number_format((float)$externo, 2) }}</td>
        <td></td>
    </tr>
    <tr>
        <td>SEGUROS</td>
        <td class="sub">PACIENTES CON SEGURO</td>
        <td class="right">{{ number_format((float)$seguro, 2) }}</td>
        <td></td>
    </tr>
    <tr>
        <td class="label">GASTOS</td>
        <td class="sub">EGRESOS</td>
        <td class="right">{{ number_format((float)$egreso, 2) }}</td>
        <td class="right">{{ number_format((float)$gastos, 2) }}</td>
    </tr>
    <tr>
        <td></td>
        <td class="sub">COMPRAS FARMACIA</td>
        <td class="right green">{{ number_format((float)$comprasFarmacia, 2) }}</td>
        <td></td>
    </tr>
    <tr class="total-row">
        <td colspan="3">SALDO A FAVOR</td>
        <td class="right">{{ number_format((float)$saldoFavor, 2) }}</td>
    </tr>
    </tbody>
</table>

<div class="head">
    UTILIDAD DE FARMACIA
    <small>CORRESPONDIENTE AL PERIODO SELECCIONADO</small>
</div>
<table>
    <thead>
    <tr>
        <th style="width:25%">Concepto</th>
        <th>Pacientes</th>
        <th style="width:25%">Montos</th>
        <th style="width:18%"></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="label">MEDICAMENTOS</td>
        <td class="sub">SEGUN INGRESO</td>
        <td class="right">{{ number_format((float)$costoSegunIngreso, 2) }}</td>
        <td></td>
    </tr>
    <tr>
        <td class="label">GANANCIA</td>
        <td class="sub">UTILIDAD FARMACIA</td>
        <td class="right green">{{ number_format((float)$utilidadFarmacia, 2) }}</td>
        <td></td>
    </tr>
    <tr class="total-row">
        <td colspan="3">TOTAL VENTAS</td>
        <td class="right">{{ number_format((float)$totalVentas, 2) }}</td>
    </tr>
    </tbody>
</table>
</body>
</html>

