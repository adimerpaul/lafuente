<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reporte de Pacientes</title>
    <style>
        @page { size: letter landscape; margin: 24px; }
        * { box-sizing: border-box; font-family: DejaVu Sans, Arial, sans-serif; }
        body { font-size: 10px; color: #111827; }
        .header { border-bottom: 2px solid #0f766e; padding-bottom: 8px; margin-bottom: 10px; }
        .title { font-size: 16px; font-weight: 800; color: #0f766e; }
        .meta { font-size: 9px; color: #4b5563; margin-top: 4px; }
        .summary { margin-bottom: 10px; padding: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; }
        .section { margin-top: 12px; }
        .section-title { font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #e2e8f0; border: 1px solid #cbd5e1; padding: 4px; font-size: 9px; text-align: left; }
        td { border: 1px solid #e5e7eb; padding: 4px; font-size: 9px; vertical-align: top; }
        .center { text-align: center; }
        .muted { color: #6b7280; }
        .empty { padding: 8px; border: 1px dashed #cbd5e1; color: #6b7280; }
    </style>
</head>
<body>
<div class="header">
    <div class="title">Reporte de Pacientes Internos y Altas</div>
    <div class="meta">
        Generado: {{ $generadoEn->format('Y-m-d H:i:s') }}<br>
        Rango de altas:
        @if($fechaAltaInicio && $fechaAltaFin)
            {{ $fechaAltaInicio }} a {{ $fechaAltaFin }}
        @else
            Sin rango seleccionado
        @endif
    </div>
</div>

<div class="summary">
    <b>Internos actuales:</b> {{ $internos->count() }}
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <b>Altas registradas:</b> {{ $altas->count() }}
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <b>Altas en rango:</b> {{ $altasRango->count() }}
</div>

<div class="section">
    <div class="section-title">Pacientes Internos Actuales</div>
    @if($internos->count())
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>Paciente</th>
                <th>CI</th>
                <th>Fecha registro</th>
                <th>Registrado por</th>
                <th>Estado</th>
            </tr>
            </thead>
            <tbody>
            @foreach($internos as $index => $paciente)
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    <td>{{ $paciente->nombre_completo }}</td>
                    <td>{{ $paciente->identificacion ?: '-' }}</td>
                    <td>{{ $paciente->fecha_creacion ?: '-' }}</td>
                    <td>{{ $paciente->registroUser->name ?? '-' }}</td>
                    <td>{{ $paciente->estado_internacion }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <div class="empty">No hay pacientes internos activos.</div>
    @endif
</div>

<div class="section">
    <div class="section-title">Pacientes Dados de Alta</div>
    @if($altas->count())
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>Paciente</th>
                <th>CI</th>
                <th>Fecha registro</th>
                <th>Registrado por</th>
                <th>Fecha alta</th>
                <th>Dado de alta por</th>
            </tr>
            </thead>
            <tbody>
            @foreach($altas as $index => $paciente)
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    <td>{{ $paciente->nombre_completo }}</td>
                    <td>{{ $paciente->identificacion ?: '-' }}</td>
                    <td>{{ $paciente->fecha_creacion ?: '-' }}</td>
                    <td>{{ $paciente->registroUser->name ?? '-' }}</td>
                    <td>{{ $paciente->fecha_alta ?: '-' }}</td>
                    <td>{{ $paciente->altaUser->name ?? '-' }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <div class="empty">No hay pacientes dados de alta.</div>
    @endif
</div>

<div class="section">
    <div class="section-title">Pacientes Dados de Alta en el Rango</div>
    @if($fechaAltaInicio && $fechaAltaFin)
        @if($altasRango->count())
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Paciente</th>
                    <th>CI</th>
                    <th>Fecha alta</th>
                    <th>Dado de alta por</th>
                    <th>Registrado por</th>
                </tr>
                </thead>
                <tbody>
                @foreach($altasRango as $index => $paciente)
                    <tr>
                        <td class="center">{{ $index + 1 }}</td>
                        <td>{{ $paciente->nombre_completo }}</td>
                        <td>{{ $paciente->identificacion ?: '-' }}</td>
                        <td>{{ $paciente->fecha_alta ?: '-' }}</td>
                        <td>{{ $paciente->altaUser->name ?? '-' }}</td>
                        <td>{{ $paciente->registroUser->name ?? '-' }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        @else
            <div class="empty">No hay altas en el rango seleccionado.</div>
        @endif
    @else
        <div class="empty">Seleccione fecha inicio y fecha fin para listar las altas por rango.</div>
    @endif
</div>
</body>
</html>
