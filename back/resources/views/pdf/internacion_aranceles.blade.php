<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Aranceles de internación</title>
    <style>
        @page { margin: 24px 28px 30px; }
        body { font-family: DejaVu Sans, sans-serif; color: #263238; font-size: 9px; }
        h1 { margin: 0; color: #0f4c81; font-size: 17px; }
        .subtitle { margin-top: 3px; color: #607d8b; font-size: 9px; }
        .header { width: 100%; border-collapse: collapse; border-bottom: 3px solid #0ea5e9; }
        .header td { padding: 0 0 7px; vertical-align: middle; }
        .logo { width: 30%; }
        .logo img { height: 34px; vertical-align: middle; }
        .brand { display: inline-block; margin-left: 7px; color: #0f4c81; font-size: 12px; font-weight: bold; }
        .report-title { width: 45%; color: #0f4c81; font-size: 15px; font-weight: bold; text-align: center; text-transform: uppercase; }
        .generated { width: 25%; color: #607d8b; font-size: 8px; text-align: right; }
        .meta { width: 100%; margin: 10px 0; border-collapse: collapse; }
        .meta td { width: 25%; padding: 4px 6px; border: 1px solid #dbe4ea; }
        .meta strong { display: block; color: #546e7a; font-size: 7px; text-transform: uppercase; }
        table.items { width: 100%; border-collapse: collapse; }
        .items th { padding: 5px; background: #0f4c81; color: white; text-align: left; }
        .items td { padding: 5px; border-bottom: 1px solid #dbe4ea; vertical-align: top; }
        .items tr:nth-child(even) td { background: #f5f8fa; }
        .right { text-align: right; }
        .total { margin-top: 8px; text-align: right; color: #0f4c81; font-size: 14px; font-weight: bold; }
        .footer { position: fixed; right: 0; bottom: -18px; left: 0; color: #78909c; text-align: center; font-size: 7px; }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td class="logo">
                <img src="{{ public_path('logo.jpg') }}" alt="Clínica La Fuente">
                <span class="brand">CLÍNICA LA FUENTE</span>
            </td>
            <td class="report-title">Aranceles de internación</td>
            <td class="generated">
                <strong>Generado</strong><br>
                {{ $generadoEn->format('d/m/Y H:i') }}
            </td>
        </tr>
    </table>

    <table class="meta">
        <tr>
            <td><strong>Paciente</strong>{{ $internacion->paciente->nombre_completo }}</td>
            <td><strong>Identificación</strong>{{ $internacion->paciente->identificacion ?: '-' }}</td>
            <td><strong>Internación</strong>#{{ $internacion->id }}</td>
            <td><strong>Cama</strong>{{ $internacion->cama }}</td>
        </tr>
        <tr>
            <td><strong>Fecha de inicio</strong>{{ optional($internacion->fecha_inicio)->format('d/m/Y H:i') }}</td>
            <td><strong>Fecha de finalización</strong>{{ optional($internacion->fecha_finalizacion)->format('d/m/Y H:i') ?: '-' }}</td>
            <td><strong>Estado</strong>{{ $internacion->estado }}</td>
            <td><strong>Registrada por</strong>{{ optional($internacion->user)->name ?: '-' }}</td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th>Fecha y hora</th>
                <th>Categoría</th>
                <th>Arancel</th>
                <th>Tipo</th>
                <th class="right">Precio unitario</th>
                <th class="right">Cantidad</th>
                <th class="right">Total</th>
                <th>Usuario</th>
            </tr>
        </thead>
        <tbody>
            @forelse($internacion->arancelesAplicados as $item)
                <tr>
                    <td>{{ optional($item->fecha_hora)->format('d/m/Y H:i') }}</td>
                    <td>{{ $item->categoria }}</td>
                    <td>{{ $item->nombre }}</td>
                    <td>{{ $item->tipo_precio }}</td>
                    <td class="right">Bs {{ number_format($item->precio_unitario, 2, ',', '.') }}</td>
                    <td class="right">{{ number_format($item->cantidad, 2, ',', '.') }}</td>
                    <td class="right">Bs {{ number_format($item->total, 2, ',', '.') }}</td>
                    <td>{{ optional($item->user)->name ?: '-' }}</td>
                </tr>
            @empty
                <tr><td colspan="8">La internación no tiene aranceles aplicados.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="total">Total: Bs {{ number_format($total, 2, ',', '.') }}</div>
    <div class="footer">Generado el {{ $generadoEn->format('d/m/Y H:i') }}</div>
</body>
</html>
