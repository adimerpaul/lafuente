<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Caja Recepción</title>
    <style>
        @page { size: letter; margin: 28px 26px; }
        * { box-sizing: border-box; font-family: DejaVu Sans, Arial, Helvetica, sans-serif; }
        body { margin: 0; color: #111827; font-size: 11px; line-height: 1.25; }
        .header { border-bottom: 2px solid #0f4c81; padding-bottom: 8px; margin-bottom: 10px; }
        .brand { display: flex; align-items: center; justify-content: space-between; }
        .title { font-size: 15px; font-weight: 800; color: #0f4c81; text-transform: uppercase; }
        .meta { font-size: 10px; text-align: right; }
        .card { border: 1px solid #d1d5db; border-radius: 8px; padding: 8px; margin-bottom: 8px; }
        .grid { width: 100%; border-collapse: collapse; }
        .grid td { border: 1px solid #e5e7eb; padding: 5px 6px; vertical-align: top; }
        .label { width: 26%; font-weight: 700; background: #f8fafc; }
        .right { text-align: right; }
        .strong { font-weight: 800; }
        .totals td { font-size: 12px; }
        .obs { min-height: 54px; white-space: pre-wrap; }
    </style>
</head>
<body>
@php
    $paciente = $item->paciente;
    $doctor = $item->doctor;
    $usuario = $item->user;
@endphp

<div class="header">
    <div class="brand">
        <div style="display:flex;align-items:center;gap:8px;">
            <img src="{{ public_path('logo.jpg') }}" alt="CLINICA LA FUENTE" style="height:30px;">
            <div class="title">Caja Recepción - Comprobante</div>
        </div>
        <div class="meta">
            <div><b>Emisión:</b> {{ $hoy->format('d/m/Y H:i') }}</div>
            <div><b>Registro:</b> #{{ $item->id }}</div>
        </div>
    </div>
</div>

<div class="card">
    <table class="grid">
        <tr>
            <td class="label">Fecha / hora</td>
            <td>{{ $item->fecha }} {{ $item->hora ?: '' }}</td>
            <td class="label">Estado</td>
            <td>{{ $item->estado_label }}</td>
        </tr>
        <tr>
            <td class="label">Paciente</td>
            <td>{{ optional($paciente)->nombre_completo ?: 'SN' }}</td>
            <td class="label">N° ficha</td>
            <td>{{ $item->numero_ficha ?: '—' }}</td>
        </tr>
        <tr>
            <td class="label">Médico</td>
            <td>{{ optional($doctor)->nombre ?: '—' }}</td>
            <td class="label">Encargado</td>
            <td>{{ optional($usuario)->name ?: '—' }}</td>
        </tr>
        <tr>
            <td class="label">Documento</td>
            <td>{{ $item->documento_label }}</td>
            <td class="label">N° fact./recibo</td>
            <td>{{ $item->nombre_factura ?: '—' }}</td>
        </tr>
        <tr>
            <td class="label">Tipo atención</td>
            <td>{{ $item->tipo_atencion ?: '—' }}</td>
            <td class="label">Movimiento</td>
            <td>{{ $item->tipo_movimiento ?: '—' }}</td>
        </tr>
    </table>
</div>

<div class="card">
    <table class="grid totals">
        <tr>
            <td class="label">Recaudado total</td>
            <td class="right strong">{{ number_format((float)$item->recaudado_total, 2) }} Bs</td>
            <td class="label">Costo farmacia</td>
            <td class="right">{{ number_format((float)$item->costo_farmacia, 2) }} Bs</td>
        </tr>
        <tr>
            <td class="label">QR</td>
            <td class="right">{{ number_format((float)$item->qr, 2) }} Bs</td>
            <td class="label">Egreso</td>
            <td class="right">{{ number_format((float)$item->egreso, 2) }} Bs</td>
        </tr>
        <tr>
            <td class="label">Efectivo</td>
            <td class="right">{{ number_format((float)$item->efectivo, 2) }} Bs</td>
            <td class="label">Saldo final caja</td>
            <td class="right strong">{{ number_format((float)$item->saldo_final, 2) }} Bs</td>
        </tr>
    </table>
</div>

<div class="card">
    <div class="strong" style="margin-bottom:4px;">Observaciones</div>
    <div class="obs">{{ $item->observaciones ?: '—' }}</div>
</div>
</body>
</html>
