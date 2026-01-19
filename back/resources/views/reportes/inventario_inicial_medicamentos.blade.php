<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Inventario Inicial de Medicamentos</title>
    <style>
        @page { margin: 8mm 6mm 10mm 6mm; }
        * { font-family: DejaVu Sans, Arial, sans-serif; color:#111; }
        body { font-size: 7.2px; line-height: 1.05; }

        .header{
            border: 0.7px solid #111;
            padding: 4px 6px;
            margin-bottom: 4px;
        }
        .row { width: 100%; }
        .left { width: 14%; display:inline-block; vertical-align: top; }
        .mid  { width: 62%; display:inline-block; vertical-align: top; text-align:center; }
        .right{ width: 24%; display:inline-block; vertical-align: top; text-align:right; }

        .title { font-size: 11px; font-weight: 700; }
        .subtitle { font-size: 7px; margin-top: 1px; }

        table { width:100%; border-collapse: collapse; table-layout: fixed; }
        th, td { border: 0.6px solid #111; padding: 1px 2px; overflow: hidden; }
        th { background:#f1f1f1; font-size: 7px; text-align:center; }
        td { vertical-align: top; }

        .center { text-align:center; }
        .rightTxt { text-align:right; }
        .nowrap { white-space: nowrap; }

        /* truco para que PRODUCTO use más espacio visual */
        .producto { font-weight: 600; }

        .totalsBox{
            margin-top: 4px;
            border: 0.7px solid #111;
            padding: 3px 6px;
            font-size: 7px;
        }
    </style>
</head>
<body>

<div class="header">
    <div class="row">
        <div class="left">
            @if(!empty($logoBase64))
                <img src="{{ $logoBase64 }}" style="width: 70px; height:auto;">
            @endif
        </div>

        <div class="mid">
            <div class="title">INVENTARIO INICIAL DE MEDICAMENTOS</div>
            <div class="subtitle">AL {{ $now->format('d/m/Y') }}</div>
        </div>

        <div class="right">
            <div><b>Fecha:</b> {{ $now->format('d/m/Y') }}</div>
            <div><b>Hora:</b> {{ $now->format('H:i') }}</div>
            <div><b>Usuario:</b> {{ $user?->name ?? '-' }}</div>
        </div>
    </div>
</div>

<table>
    <thead>
    <tr>
        <th style="width:3%;">N°</th>
        <th style="width:29%;">PRODUCTO</th>
        <th style="width:18%;">D.C.I.</th>
        <th style="width:7%;">PRES.</th>
        <th style="width:14%;">LAB.</th>
        <th style="width:8%;">VTO</th>
        <th style="width:5%;">CANT</th>
        <th style="width:6%;">P.C</th>
        <th style="width:6%;">P.V</th>
        <th style="width:4%;">TOT</th>
    </tr>
    </thead>

    <tbody>
    @forelse($rows as $i => $r)
        <tr>
            <td class="center">{{ $i + 1 }}</td>
            <td class="producto">{{ $r->producto ?? '-' }}</td>
            <td>{{ $r->dci ?? '' }}</td>
            <td class="center nowrap">{{ $r->presentacion ?? '' }}</td>
            <td>{{ $r->laboratorio ?? '' }}</td>
            <td class="center nowrap">{{ $r->vencimiento ?? '' }}</td>
            <td class="rightTxt">{{ number_format((float)$r->cant, 0) }}</td>
            <td class="rightTxt">{{ number_format((float)$r->p_compra, 2) }}</td>
            <td class="rightTxt">{{ number_format((float)$r->p_venta, 2) }}</td>
            <td class="rightTxt">{{ number_format((float)$r->total, 2) }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="10" class="center">No existen medicamentos con stock disponible.</td>
        </tr>
    @endforelse
    </tbody>
</table>

<div class="totalsBox">
    <b>Ítems:</b> {{ count($rows) }}
    &nbsp;&nbsp; <b>Cantidad:</b> {{ number_format($sumCantidad, 0) }}
    &nbsp;&nbsp; <b>Total costo:</b> {{ number_format($sumTotal, 2) }}
</div>

</body>
</html>
