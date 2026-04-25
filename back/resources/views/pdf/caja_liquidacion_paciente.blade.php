<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Hoja de liquidacion</title>
    <style>
        @page { size: letter; margin: 24px; }
        * { box-sizing: border-box; font-family: DejaVu Sans, Arial, Helvetica, sans-serif; }
        body { margin: 0; color: #0b2540; font-size: 10px; line-height: 1.05; }

        .header {
            display: flex; justify-content: space-between; align-items: flex-end;
            border-bottom: 2px solid #0b67d0; padding-bottom: 6px; margin-bottom: 6px;
        }
        .brand {
            color: #0b67d0; font-weight: 800; display: flex; align-items: center; gap: 8px;
        }
        .title {
            font-size: 14px; font-weight: 900; color: #0b67d0;
            text-transform: uppercase; letter-spacing: .5px; text-align: center;
        }
        .meta { font-size: 9px; text-align: right; }
        .sheet-type { margin-top: 2px; font-size: 9px; color: #084a9e; text-transform: uppercase; font-weight: 700; }

        .patient {
            display: flex; justify-content: space-between; align-items: flex-end;
            background: #eef8ff; border: 1px solid #cfe7ff; padding: 5px 7px;
            margin-bottom: 6px; border-radius: 6px;
        }
        .patient b { font-weight: 800; }
        .muted { color: #6b7280; font-size: 9px; }

        .section {
            margin-top: 6px; border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden;
        }
        .section-title {
            background: #e6f0ff; color: #084a9e; font-size: 11px; font-weight: 900;
            text-transform: uppercase; padding: 4px 6px; letter-spacing: .5px;
        }
        table { width: 100%; border-collapse: collapse; }
        th {
            background: #f1f5f9; border: 1px solid #cbd5e1; padding: 3px 4px;
            font-size: 8px; text-align: center; font-weight: 800;
        }
        td { border: 1px solid #e5e7eb; padding: 3px 4px; font-size: 8.5px; }
        .right { text-align: right; }
        .center { text-align: center; }

        .total-row td {
            background: #eef8ff; color: #084a9e; font-weight: 800; text-transform: uppercase;
        }

        .summary {
            margin-top: 7px; border: 1px solid #cfe7ff; background: #eef8ff; padding: 6px 8px;
            border-radius: 6px;
        }
        .summary-row { display: flex; justify-content: space-between; padding: 1px 0; font-size: 10px; }
        .summary-row strong { font-weight: 900; }

        .grand-total {
            margin-top: 6px; display: flex; justify-content: space-between;
            border-top: 2px solid #0b67d0; padding-top: 6px;
            font-size: 14px; font-weight: 900; color: #0b67d0; text-transform: uppercase;
        }
    </style>
</head>
<body>
@php
    $nombrePaciente = $paciente->nombre_completo ?: ($paciente->nombre ?? '—');
    $labelTipo = match($tipoImpresion ?? 'todo') {
        'paga_ahora' => 'Impresion: Paga ahora',
        'pagado_luego' => 'Impresion: Pagado luego',
        default => 'Impresion: Todo',
    };
@endphp

<div class="header">
    <div class="brand">
        <img src="{{ public_path('logo.jpg') }}" alt="CLINICA LA FUENTE" style="height:28px;">
        <div>CLINICA LA FUENTE</div>
    </div>
    <div>
        <div class="title">Hoja de liquidacion por atenciones prestadas</div>
        <div class="sheet-type">{{ $labelTipo }}</div>
    </div>
    <div class="meta">
        <div><b>Fecha:</b> {{ $hoy->format('d/m/Y') }}</div>
        <div><b>Hora:</b> {{ $hoy->format('H:i') }}</div>
    </div>
</div>

<div class="patient">
    <div>
        <div><b>Nombre del paciente:</b> {{ $nombrePaciente }}</div>
        <div><b>Tipo:</b> {{ $paciente->tipo_paciente ?: '—' }}</div>
    </div>
    <div class="right">
        <div><b>Desde:</b> {{ $fechaInicio ?: '—' }}</div>
        <div><b>Hasta:</b> {{ $fechaFin ?: '—' }}</div>
    </div>
</div>

<div class="section">
    <div class="section-title">Atenciones clinica</div>
    <table>
        @forelse($rowsClinica as $row)
            <tr>
                <td>{{ strtoupper($row['label']) }}</td>
                <td class="right" style="width:120px;">{{ number_format((float) $row['monto'], 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="2" class="center muted">Sin cargos de atencion clinica en el rango.</td></tr>
        @endforelse
        <tr class="total-row">
            <td>Total atencion clinica</td>
            <td class="right">{{ number_format((float) $totalClinica, 2) }}</td>
        </tr>
    </table>
</div>

<div class="section">
    <div class="section-title">Farmacia (consumo del paciente)</div>
    <table>
        <tr>
            <th style="width:88px;">Fecha</th>
            <th>Detalle</th>
            <th style="width:120px;">Monto</th>
        </tr>
        @forelse($rowsFarmacia as $row)
            <tr>
                <td class="center">{{ $row['fecha'] ?: '—' }}</td>
                <td>{{ $row['detalle'] }}</td>
                <td class="right">{{ number_format((float) $row['monto'], 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="3" class="center muted">Sin consumo de farmacia en el rango.</td></tr>
        @endforelse
        <tr class="total-row">
            <td colspan="2">Total farmacia</td>
            <td class="right">{{ number_format((float) $totalFarmacia, 2) }}</td>
        </tr>
    </table>
</div>

<div class="section">
    <div class="section-title">Honorarios profesionales</div>
    <table>
        @forelse($rowsHonorarios as $row)
            <tr>
                <td>{{ strtoupper($row['label']) }}</td>
                <td class="right" style="width:120px;">{{ number_format((float) $row['monto'], 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="2" class="center muted">Sin honorarios en el rango.</td></tr>
        @endforelse
        <tr class="total-row">
            <td>Total honorarios profesionales</td>
            <td class="right">{{ number_format((float) $totalHonorarios, 2) }}</td>
        </tr>
    </table>
</div>

<div class="section">
    <div class="section-title">Detalle de registros de caja ({{ $items->count() }})</div>
    <table>
        <tr>
            <th style="width:30px;">#</th>
            <th style="width:80px;">Fecha</th>
            <th style="width:74px;">Tipo</th>
            <th style="width:95px;">Estado pago</th>
            <th style="width:95px;">Cobro luego</th>
            <th style="width:95px;">Cobrado por</th>
            <th style="width:82px;">Recaudado</th>
            <th style="width:82px;">Farmacia</th>
            <th style="width:82px;">Egreso</th>
        </tr>
        @forelse($items as $index => $item)
            @php
                $modo = ($item->estado_cobro ?? 'Pendiente') === 'Pagado' ? 'Paga ahora' : 'Paga luego';
                $cobroLuego = $item->fecha_cobro ? \Carbon\Carbon::parse($item->fecha_cobro)->format('d/m/Y H:i') : '—';
            @endphp
            <tr>
                <td class="center">{{ $index + 1 }}</td>
                <td class="center">{{ $item->fecha ?: '—' }}</td>
                <td class="center">{{ $item->tipo_atencion ?: '—' }}</td>
                <td class="center">{{ $modo }}</td>
                <td class="center">{{ $cobroLuego }}</td>
                <td class="center">{{ optional($item->cobradoPor)->name ?: '—' }}</td>
                <td class="right">{{ number_format((float) ($item->recaudado_total ?? 0), 2) }}</td>
                <td class="right">{{ number_format((float) ($item->costo_farmacia ?? 0), 2) }}</td>
                <td class="right">{{ number_format((float) ($item->egreso ?? 0), 2) }}</td>
            </tr>
        @empty
            <tr><td colspan="9" class="center muted">Sin registros para esta impresion.</td></tr>
        @endforelse
    </table>
</div>

<div class="summary">
    <div class="summary-row"><span>Total paga ahora:</span> <strong>{{ number_format((float) $totalPagaAhora, 2) }}</strong></div>
    <div class="summary-row"><span>Total paga luego:</span> <strong>{{ number_format((float) $totalPagaLuego, 2) }}</strong></div>
    <div class="summary-row"><span>Total atencion clinica:</span> <strong>{{ number_format((float) $totalClinica, 2) }}</strong></div>
    <div class="summary-row"><span>Total farmacia:</span> <strong>{{ number_format((float) $totalFarmacia, 2) }}</strong></div>
    <div class="summary-row"><span>Total honorarios:</span> <strong>{{ number_format((float) $totalHonorarios, 2) }}</strong></div>
</div>

<div class="grand-total">
    <span>Total a cobrar</span>
    <span>{{ number_format((float) $totalCobrar, 2) }}</span>
</div>
</body>
</html>
