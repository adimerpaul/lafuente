<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Proforma de Farmacia</title>
    <style>
        *{ box-sizing:border-box; font-family: DejaVu Sans, Arial, Helvetica, sans-serif; }
        body{ margin: 14px; color:#1d1d1f; font-size:12px; }
        .header{
            display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0ea5e9; padding-bottom:6px; margin-bottom:8px;
        }
        .brand{ font-weight:700; color:#0ea5e9; display:flex; align-items:center; gap:10px; }
        .logo{ width:26px; height:26px; border:2px solid #0ea5e9; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; }
        .title{ font-size:18px; font-weight:700; color:#0ea5e9; text-transform:uppercase; }
        .meta{ font-size:11px; color:#333; text-align:right; }

        .bloque{ width:100%; border-collapse:collapse; margin-top:8px; }
        .head{ background:#f0f9ff; border:1px solid #cce7f6; padding:6px; font-size:12px; }
        .rowtop{ display:flex; justify-content:space-between; }
        .thead th{ background:#e2e8f0; border:1px solid #cbd5e1; padding:5px; font-size:11px; text-align:center; }
        td{ border:1px solid #e5e7eb; padding:5px; font-size:11px; }
        .right{ text-align:right; }
        .center{ text-align:center; }
        .total td{ background:#f8fafc; }
        .grand{ margin-top:10px; display:flex; justify-content:flex-end; font-size:13px; font-weight:700; }
        .muted{ color:#777; font-size:11px; }
    </style>
</head>
<body>
<div class="header">
    <div class="brand">
        <div class="logo">LF</div>
        <div>CLÍNICA LA FUENTE</div>
    </div>
    <div class="title">PROFORMA DE FARMACIA</div>
    <div class="meta">
        <div><b>Fecha:</b> {{ $hoy->format('d/m/Y') }}</div>
        <div><b>Hora:</b> {{ $hoy->format('H:i') }}</div>
    </div>
</div>

@php
    // helper para edad simple (años)
    $edad = '';
    try {
      if ($paciente->fecha_nacimiento) {
        $edad = \Carbon\Carbon::parse($paciente->fecha_nacimiento)->age;
      }
    } catch (\Throwable $e) {}
@endphp

@forelse($pacienteVentas as $pv)
    @php
        $venta = $pv->venta;
        if (!$venta) continue;
        $detalles = $venta->ventaDetalles ?? collect();
        $fechaVenta = $venta->fecha ?? (\Illuminate\Support\Str::limit($pv->fecha, 10, ''));
        $doctor = $venta->doctor;
        $totalVenta = is_null($venta->total)
          ? $detalles->sum(function($d){ return floatval($d->cantidad) * floatval($d->precio); })
          : floatval($venta->total);
    @endphp

    <table class="bloque">
        <tr>
            <td class="head" colspan="6">
                <div class="rowtop">
                    <div>
                        <b>PACIENTE:</b> {{ $paciente->nombre_completo ?? ($paciente->nombre.' '.$paciente->apellido) }}
                        &nbsp; <b>EDAD:</b> {{ $edad !== '' ? $edad : '—' }}
                        &nbsp; <span class="muted">({{ $venta->tipo_venta }})</span>
                    </div>
                    <div><b>FECHA:</b> {{ $fechaVenta }}</div>
                </div>
                @if($doctor)
                    <div class="rowtop" style="margin-top:3px;">
                        <b>DOCTOR(A):</b> {{ $doctor->nombre }} @if(!empty($doctor->especialidad)) — {{ $doctor->especialidad }} @endif
                    </div>
                @endif
            </td>
        </tr>
        <tr class="thead">
            <th style="width:40px;">N°</th>
            <th style="width:70px;">CANTIDAD</th>
            <th>MEDICAMENTOS o INSUMOS</th>
            <th style="width:90px;">UNIDAD</th>
            <th style="width:100px;">P/UNITARIO</th>
            <th style="width:110px;">IMPORTE (Bs.)</th>
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
            <tr><td colspan="6" class="center muted">Sin productos</td></tr>
        @endforelse

        <tr class="total">
            <td colspan="5" class="right"><b>TOTAL</b></td>
            <td class="right"><b>{{ number_format($totalVenta, 2) }}</b></td>
        </tr>
    </table>

    <div style="height:12px;"></div>
@empty
    <p class="muted">No hay ventas vinculadas.</p>
@endforelse

<div class="grand">
    MONTO TOTAL: &nbsp; {{ number_format($totalGeneral, 2) }} Bs.
</div>
</body>
</html>
