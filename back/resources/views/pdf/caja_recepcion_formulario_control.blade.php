<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Formulario de Control - Caja Recepción</title>
    <style>
        @page { size: letter; margin: 18px 14px; }
        * { box-sizing: border-box; font-family: DejaVu Sans, Arial, Helvetica, sans-serif; }
        body { margin: 0; color: #111827; font-size: 11px; }
        .header { margin-bottom: 8px; border-bottom: 2px solid #1f2937; padding-bottom: 6px; }
        .brand-row { display: flex; justify-content: space-between; align-items: center; }
        .title { text-align: center; font-weight: 800; text-transform: uppercase; font-size: 14px; letter-spacing: 0.4px; }
        .subtitle { text-align: center; font-size: 11px; margin-top: 2px; }
        .meta { font-size: 10px; text-align: right; }
        .line-table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 4px; }
        .line-table td { border: 1px solid #1f2937; padding: 5px 6px; font-size: 12px; }
        .line-label { width: 12%; font-weight: 700; }
        .line-value { width: 38%; }
        .main { width: 100%; border-collapse: collapse; }
        .main td, .main th { border: 1px solid #111827; padding: 4px; font-size: 11px; }
        .main th { background: #f3f4f6; font-size: 10px; text-transform: uppercase; }
        .name-col { width: 40%; font-weight: 700; }
        .opt-col { width: 4.2%; text-align: center; }
        .mark { font-weight: 900; font-size: 13px; margin-left: 2px; }
        .qty-cell { text-align: center; font-weight: 700; font-size: 10px; }
        .obs { margin-top: 8px; border: 1px solid #111827; min-height: 52px; padding: 6px; white-space: pre-wrap; }
        .total-box {
            margin-top: 8px;
            border: 1px solid #111827;
            padding: 6px;
            text-align: right;
            font-weight: 800;
            font-size: 12px;
        }
    </style>
</head>
<body>
@php
    $paciente = $item->paciente;
    $pacienteNombre = optional($paciente)->nombre_completo ?: trim((optional($paciente)->nombre ?? '').' '.(optional($paciente)->apellido ?? ''));
    $edad = optional($paciente)->edad ?: '—';
    $diag = $item->formulario_diagnostico ?: '—';
    $detalleSafe = is_array($detalle ?? null) ? $detalle : [];

    $toArray = function ($value) {
        if (is_array($value)) return $value;
        if ($value === null || $value === '') return [];
        return [$value];
    };
    $isMarked = function (string $key, string $option) use ($detalleSafe, $toArray) {
        return in_array($option, $toArray($detalleSafe[$key] ?? null), true);
    };
    $quantityValue = function (string $key, array $options = []) use ($detalleSafe, $toArray) {
        $values = $toArray($detalleSafe[$key] ?? null);
        foreach ($values as $value) {
            if (!in_array($value, $options, true) && $value !== null && $value !== '') {
                return (string) $value;
            }
        }
        return '';
    };
@endphp

<div class="header">
    <div class="brand-row">
        <div style="display:flex;align-items:center;gap:8px;">
            <img src="{{ public_path('logo.jpg') }}" alt="CLINICA LA FUENTE" style="height:32px;">
            <div style="font-weight:700;">CLÍNICA LA FUENTE</div>
        </div>
        <div class="meta">
            <div><b>Registro:</b> #{{ $item->id }}</div>
            <div><b>Emitido:</b> {{ $hoy->format('d/m/Y H:i') }}</div>
        </div>
    </div>
    <div class="title">Formulario de Control</div>
    <div class="subtitle">Insumos de Emergencia</div>
</div>

<table class="line-table">
    <tr>
        <td class="line-label">NOMBRE:</td>
        <td class="line-value">{{ $pacienteNombre ?: 'SN' }}</td>
        <td class="line-label">EDAD:</td>
        <td class="line-value">{{ $edad }}</td>
    </tr>
    <tr>
        <td class="line-label">DIAGNÓSTICO:</td>
        <td class="line-value">{{ $diag }}</td>
        <td class="line-label">FECHA:</td>
        <td class="line-value">{{ $item->fecha ?: '—' }}</td>
    </tr>
</table>

<table class="main">
    <thead>
    <tr>
        <th class="name-col">Control</th>
        <th class="opt-col">1</th>
        <th class="opt-col">2</th>
        <th class="opt-col">3</th>
        <th class="name-col">Control</th>
        <th class="opt-col">1</th>
        <th class="opt-col">2</th>
        <th class="opt-col">3</th>
    </tr>
    </thead>
    <tbody>
    @foreach($rows as $row)
        @php
            $left = $row['left'];
            $right = $row['right'];
            $leftOptions = $left['options'] ?? [];
            $rightOptions = $right['options'] ?? [];
            $leftQty = $quantityValue($left['key'], $leftOptions);
            $rightQty = $quantityValue($right['key'], $rightOptions);
        @endphp
        <tr>
            <td class="name-col">{{ $left['label'] }}</td>
            @for($i = 0; $i < 3; $i++)
                @php $option = $leftOptions[$i] ?? ''; @endphp
                <td class="opt-col {{ $option === 'CANTIDAD' ? 'qty-cell' : '' }}">
                    @if($option === 'CANTIDAD')
                        {{ $leftQty }}
                    @else
                        {{ $option }}
                        @if($option && $isMarked($left['key'], $option))
                            <span class="mark">*</span>
                        @endif
                    @endif
                </td>
            @endfor
            <td class="name-col">{{ $right['label'] }}</td>
            @for($i = 0; $i < 3; $i++)
                @php $option = $rightOptions[$i] ?? ''; @endphp
                <td class="opt-col {{ $option === 'CANTIDAD' ? 'qty-cell' : '' }}">
                    @if($option === 'CANTIDAD')
                        {{ $rightQty }}
                    @else
                        {{ $option }}
                        @if($option && $isMarked($right['key'], $option))
                            <span class="mark">*</span>
                        @endif
                    @endif
                </td>
            @endfor
        </tr>
    @endforeach
    </tbody>
</table>

<div class="total-box">
    TOTAL REFERENCIAL: {{ number_format((float) ($totalReferencial ?? 0), 2) }} Bs
</div>

<div class="obs">
    <b>OBSERVACIONES:</b> {{ $item->formulario_observaciones ?: '—' }}
</div>
</body>
</html>
