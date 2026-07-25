<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #263238; font-size: 10px; }
        .header { background: #283593; color: white; padding: 14px; text-align: center; }
        .header h1 { margin: 0; font-size: 18px; }
        .header div { margin-top: 4px; font-size: 11px; }
        .info { margin: 12px 0; padding: 9px; background: #e8eaf6; border-left: 4px solid #3949ab; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #3949ab; color: white; padding: 7px 5px; }
        td { padding: 6px 5px; border-bottom: 1px solid #d9dceb; }
        tr:nth-child(even) td { background: #f5f6fb; }
        .right { text-align: right; }
        .center { text-align: center; }
        .footer { position: fixed; bottom: -20px; width: 100%; color: #607d8b; font-size: 8px; text-align: center; }
    </style>
</head>
<body>
<div class="header">
    <h1>CLÍNICA LA FUENTE</h1>
    <div>ACTIVOS FIJOS BAJO RESPONSABILIDAD</div>
</div>
<div class="info">
    <b>Funcionario:</b> {{ $funcionario->name }} &nbsp;&nbsp;
    <b>Cargo:</b> {{ $funcionario->role ?: '-' }} &nbsp;&nbsp;
    <b>Total:</b> {{ $rows->count() }} activos &nbsp;&nbsp;
    <b>Generado:</b> {{ $generatedAt }}
</div>
<table>
    <thead>
    <tr>
        <th>#</th><th>Código</th><th>Activo</th><th>Estado</th><th>Valor</th>
        <th>Fecha asignación</th><th>Asignado por</th><th>Observación</th>
    </tr>
    </thead>
    <tbody>
    @forelse($rows as $index => $item)
        <tr>
            <td class="center">{{ $index + 1 }}</td>
            <td>{{ $item->activoFijo?->codigo ?: '-' }}</td>
            <td>{{ $item->activoFijo?->nombre }}</td>
            <td>{{ $item->activoFijo?->estado }}</td>
            <td class="right">{{ number_format((float) $item->activoFijo?->valor, 2) }} Bs</td>
            <td>{{ $item->fecha_asignacion?->format('d/m/Y H:i') }}</td>
            <td>{{ $item->asignador?->name ?: 'Sistema/migración' }}</td>
            <td>{{ $item->observacion ?: '-' }}</td>
        </tr>
    @empty
        <tr><td colspan="8" class="center">El funcionario no tiene activos asignados actualmente.</td></tr>
    @endforelse
    </tbody>
</table>
<div class="footer">Documento de control patrimonial — Clínica La Fuente</div>
</body>
</html>
