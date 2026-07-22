<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Formulario de Control</title>
    <style>
        @page { size: letter; margin: 30px 30px; }
        * { box-sizing: border-box; font-family: DejaVu Sans, Arial, Helvetica, sans-serif; }
        body { margin: 0; color: #111827; font-size: 12px; line-height: 1.05; }
        .header {
            display: flex; justify-content: space-between; align-items: flex-end;
            border-bottom: 2px solid #0ea5e9; padding-bottom: 6px; margin-bottom: 6px;
        }
        .brand { font-weight: 800; color: #0ea5e9; display: flex; align-items: center; gap: 8px; }
        .title { font-size: 13px; font-weight: 900; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.6px; }
        .meta { font-size: 9px; color: #111827; text-align: right; }
        .patient {
            display: flex; justify-content: space-between; align-items: flex-end;
            background: #f0f9ff; border: 1px solid #cce7f6; padding: 6px; margin-bottom: 6px; border-radius: 6px;
        }
        .muted { color: #6b7280; font-size: 9px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
        th { background: #e2e8f0; border: 1px solid #cbd5e1; padding: 4px; font-size: 9px; text-align: center; font-weight: 800; }
        td { border: 1px solid #e5e7eb; padding: 4px; font-size: 9px; vertical-align: top; }
        .right { text-align: right; }
        .center { text-align: center; }
        .section {
            margin-top: 6px; padding: 6px; border: 1px solid #e5e7eb; border-radius: 6px; background: #fafafa;
        }
        .grand {
            margin-top: 6px; display: flex; justify-content: flex-end; font-size: 10px; font-weight: 900;
            padding-top: 6px; border-top: 2px solid #0ea5e9;
        }
    </style>
</head>
<body>
@php
    $paciente = $formularioControl->paciente;
    $usuario = $formularioControl->user;
    $nombrePaciente = $paciente->nombre_completo ?? trim(($paciente->nombre ?? '').' '.($paciente->apellido ?? ''));
    $edad = '';
    try {
        if (!empty($paciente->fecha_nacimiento)) {
            $edad = \Carbon\Carbon::parse($paciente->fecha_nacimiento)->age;
        } elseif (!empty($paciente->edad)) {
            $edad = $paciente->edad;
        }
    } catch (\Throwable $e) {}
@endphp

<div class="header">
    <div class="brand">
        <img src="{{ public_path('logo.jpg') }}" alt="CLINICA LA FUENTE" style="height:28px;">
        <div>CLINICA LA FUENTE</div>
    </div>
    <div class="title">FORMULARIO DE CONTROL</div>
    <div class="meta">
        <div><b>Fecha:</b> {{ optional($formularioControl->fecha)->format('d/m/Y') }}</div>
        <div><b>Hora:</b> {{ optional($formularioControl->fecha)->format('H:i') }}</div>
        <div><b>Usuario:</b> {{ $usuario->name ?? 'SN' }}</div>
    </div>
</div>

<div class="patient">
    <div>
        <b>PACIENTE:</b> {{ $nombrePaciente ?: 'SN' }}
        &nbsp;&nbsp; <b>EDAD:</b> {{ $edad !== '' ? $edad : '—' }}
        @if(!empty($paciente->identificacion))
            &nbsp;&nbsp; <span class="muted"><b>CI:</b> {{ $paciente->identificacion }}</span>
        @endif
    </div>
    <div class="right muted">
        <b>Registro:</b> #{{ $formularioControl->id }}
    </div>
</div>

@if(!empty($formularioControl->diagnostico))
    <div class="section">
        <div><b>Diagnostico:</b></div>
        <div>{{ $formularioControl->diagnostico }}</div>
    </div>
@endif

<table>
    <tr>
        <th style="width: 30px;">#</th>
        <th>CONTROL MARCADO</th>
        <th style="width: 70px;">VALOR</th>
        <th style="width: 90px;">MONTO REF.</th>
    </tr>
    @forelse($selectedItems as $index => $item)
        <tr>
            <td class="center">{{ $index + 1 }}</td>
            <td>{{ $item['label'] }}</td>
            <td class="center">{{ $item['value'] }}</td>
            <td class="right">{{ number_format($item['amount'], 2) }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="4" class="center muted">Sin controles marcados</td>
        </tr>
    @endforelse
    <tr>
        <td colspan="3" class="right"><b>TOTAL REFERENCIAL</b></td>
        <td class="right"><b>{{ number_format($totalReferencial, 2) }}</b></td>
    </tr>
</table>

@if(!empty($formularioControl->observaciones))
    <div class="section">
        <div><b>Observaciones:</b></div>
        <div>{{ $formularioControl->observaciones }}</div>
    </div>
@endif

<div class="grand">
    TOTAL REFERENCIAL: &nbsp; {{ number_format($totalReferencial, 2) }} Bs.
</div>
</body>
</html>
