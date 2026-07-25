<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Aranceles de internación</title>
    <style>
        @page { margin: 92px 28px 42px; }
        * { box-sizing: border-box; }
        body { font-family: DejaVu Sans, sans-serif; color: #243447; font-size: 8px; }
        header { position: fixed; top: -70px; left: 0; right: 0; height: 58px; }
        .brand { background: #0f4c81; color: white; padding: 10px 14px; }
        .brand-title { font-size: 16px; font-weight: bold; letter-spacing: .5px; }
        .brand-subtitle { margin-top: 2px; font-size: 9px; color: #d8eaf7; }
        footer { position: fixed; bottom: -29px; left: 0; right: 0; color: #68788a; font-size: 7px; }
        .page:after { content: counter(page); }
        .summary { width: 100%; margin-bottom: 9px; border-collapse: separate; border-spacing: 5px 0; }
        .summary td { padding: 7px 9px; background: #edf4f9; border-left: 3px solid #0f4c81; }
        .summary-label { color: #60758a; text-transform: uppercase; font-size: 7px; }
        .summary-value { margin-top: 2px; font-size: 12px; font-weight: bold; color: #0f4c81; }
        table.data { width: 100%; border-collapse: collapse; table-layout: fixed; }
        table.data thead { display: table-header-group; }
        table.data th { padding: 6px 4px; background: #1e3a5f; color: white; text-align: left; font-size: 7px; }
        table.data td { padding: 5px 4px; border-bottom: 1px solid #dce5ec; vertical-align: top; word-wrap: break-word; }
        table.data tbody tr:nth-child(even) { background: #f5f8fa; }
        .right { text-align: right; }
        .center { text-align: center; }
        .status { display: inline-block; padding: 2px 5px; border-radius: 8px; color: white; }
        .active { background: #2e7d32; }
        .inactive { background: #78909c; }
        .muted { color: #78909c; }
    </style>
</head>
<body>
<header>
    <div class="brand">
        <div class="brand-title">CLÍNICA LA FUENTE</div>
        <div class="brand-subtitle">Catálogo de aranceles de internación</div>
    </div>
</header>
<footer>
    <span>Generado: {{ $generatedAt }}</span>
    <span style="float:right">Página <span class="page"></span></span>
</footer>

<table class="summary">
    <tr>
        <td>
            <div class="summary-label">Registros</div>
            <div class="summary-value">{{ count($rows) }}</div>
        </td>
        <td>
            <div class="summary-label">Activos</div>
            <div class="summary-value">{{ $activeCount }}</div>
        </td>
        <td>
            <div class="summary-label">Precios configurados</div>
            <div class="summary-value">{{ $pricedCount }}</div>
        </td>
        <td>
            <div class="summary-label">Filtro aplicado</div>
            <div class="summary-value" style="font-size:9px">{{ $search !== '' ? $search : 'Todos' }}</div>
        </td>
    </tr>
</table>

<table class="data">
    <thead>
    <tr>
        <th style="width:3%">#</th>
        <th style="width:13%">Categoría</th>
        <th style="width:12%">Grupo</th>
        <th style="width:21%">Nombre</th>
        <th style="width:23%">Detalle</th>
        <th style="width:10%">Tipo</th>
        <th style="width:9%" class="right">Precio</th>
        <th style="width:9%" class="center">Estado</th>
    </tr>
    </thead>
    <tbody>
    @forelse($rows as $index => $row)
        <tr>
            <td class="center">{{ $index + 1 }}</td>
            <td>{{ $row->categoria }}</td>
            <td>{{ $row->grupo ?: '-' }}</td>
            <td><strong>{{ $row->nombre }}</strong></td>
            <td class="muted">{{ $row->detalle ?: '-' }}</td>
            <td>{{ $row->tipo_precio }}</td>
            <td class="right">
                {{ $row->precio === null ? 'Variable' : 'Bs '.number_format((float) $row->precio, 2, '.', ',') }}
            </td>
            <td class="center">
                <span class="status {{ $row->activo ? 'active' : 'inactive' }}">
                    {{ $row->activo ? 'Activo' : 'Inactivo' }}
                </span>
            </td>
        </tr>
    @empty
        <tr><td colspan="8" class="center muted" style="padding:25px">No hay aranceles para mostrar.</td></tr>
    @endforelse
    </tbody>
</table>
</body>
</html>
