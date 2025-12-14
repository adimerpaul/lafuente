<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Proforma de Farmacia</title>
    <style>
        @page {
            size: letter;
            margin: 25px 25px;
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

        /* ===== HEADER GENERAL (UNA SOLA VEZ) ===== */
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

        .logo {
            width: 22px;
            height: 22px;
            border: 2px solid #0ea5e9;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 900;
            line-height: 1;
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

        .patient {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            background: #f0f9ff;
            border: 1px solid #cce7f6;
            padding: 6px 6px;
            margin-bottom: 6px;
            border-radius: 6px;
        }

        .patient .left b {
            font-weight: 800;
        }

        .muted {
            color: #6b7280;
            font-size: 9px;
        }

        /* ===== BLOQUES DE VENTA ===== */
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

        /* Para que sea más compacto */
        .nowrap {
            white-space: nowrap;
        }
    </style>
</head>
<body>

@php
    // Edad simple (años)
    $edad = '';
    try {
        if (!empty($paciente->fecha_nacimiento)) {
            $edad = \Carbon\Carbon::parse($paciente->fecha_nacimiento)->age;
        } elseif (!empty($paciente->edad)) {
            $edad = $paciente->edad;
        }
    } catch (\Throwable $e) {}

    $nombrePaciente = $paciente->nombre_completo ?? trim(($paciente->nombre ?? '').' '.($paciente->apellido ?? ''));
@endphp

    <!-- ===== HEADER (UNA VEZ) ===== -->
<div class="header">
    <div class="brand">
        {{--        <div class="logo">LF</div>--}}
        <img src="{{ public_path('logo.jpg') }}" alt="CLÍNICA LA FUENTE" style="height:28px;">
        <div>CLÍNICA LA FUENTE</div>
    </div>
    <div class="title">PROFORMA DE FARMACIA</div>
    <div class="meta">
        <div><b>Fecha:</b> {{ $hoy->format('d/m/Y') }}</div>
        <div><b>Hora:</b> {{ $hoy->format('H:i') }}</div>
    </div>
</div>

<!-- ===== PACIENTE (UNA VEZ) ===== -->
<div class="patient">
    <div class="left">
        <b>PACIENTE:</b> {{ $nombrePaciente ?: 'SN' }}
        &nbsp;&nbsp; <b>EDAD:</b> {{ $edad !== '' ? $edad : '—' }}
        @if(!empty($paciente->identificacion))
            &nbsp;&nbsp; <span class="muted"><b>CI:</b> {{ $paciente->identificacion }}</span>
        @endif
    </div>
    <div class="right muted">
        <b>Ventas:</b> {{ is_countable($pacienteVentas) ? count($pacienteVentas) : ($pacienteVentas->count() ?? 0) }}
    </div>
</div>

@forelse($pacienteVentas as $pv)
    @php
        $venta = $pv->venta;
        if (!$venta) continue;

        $detalles = $venta->ventaDetalles ?? collect();

        $fechaVenta = $venta->fecha ?? (is_string($pv->fecha) ? substr($pv->fecha, 0, 10) : '');
        $horaVenta  = $venta->hora ?? (is_string($pv->hora) ? substr($pv->hora, 0, 8) : '');

        $tipoVenta = $venta->tipo_venta ?? '';
        if ($tipoVenta === 'Interno') $tipoVenta = 'Internado';

        $doctor = $venta->doctor ?? null;

        $totalVenta = is_null($venta->total)
            ? $detalles->sum(fn($d) => floatval($d->cantidad) * floatval($d->precio))
            : floatval($venta->total);
    @endphp

    <table class="venta">
        <!-- Cabecera compacta por venta -->
        <tr class="vhead">
            <td colspan="6">
                <b>FECHA:</b> <span class="nowrap">{{ $fechaVenta }}</span>
                @if($horaVenta)
                    &nbsp;<span class="muted">({{ $horaVenta }})</span>
                @endif
                &nbsp; | &nbsp;
                <b>TIPO:</b> {{ $tipoVenta ?: '—' }}
                &nbsp; | &nbsp;
                <b>DOCTOR(A):</b>
                {{ $doctor ? $doctor->nombre : '—' }}
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
                <td class="center">{{ $i+1 }}</td>
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
            <td colspan="5" class="right">TOTAL</td>
            <td class="right">{{ number_format($totalVenta, 2) }}</td>
        </tr>
    </table>
@empty
    <div class="muted">No hay ventas vinculadas.</div>
@endforelse

<div class="grand">
    MONTO TOTAL: &nbsp; {{ number_format($totalGeneral, 2) }} Bs.
</div>

</body>
</html>
