<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reporte de Altas y Bajas</title>
    <style>
        @page { size: letter landscape; margin: 24px; }
        * { box-sizing: border-box; font-family: DejaVu Sans, Arial, sans-serif; }
        body { font-size: 10px; color: #111827; }
        .header { border-bottom: 2px solid #0f766e; padding-bottom: 8px; margin-bottom: 10px; }
        .title { font-size: 16px; font-weight: 800; color: #0f766e; }
        .meta { font-size: 9px; color: #4b5563; margin-top: 4px; }
        .summary { margin-bottom: 10px; padding: 8px; background: #f0fdf4; border: 1px solid #bbf7d0; }
        .section { margin-top: 14px; }
        .section-title { font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 6px;
                         border-left: 4px solid #0f766e; padding-left: 6px; }
        .section-title-bajas { border-left-color: #dc2626; color: #7f1d1d; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #e2e8f0; border: 1px solid #cbd5e1; padding: 4px 5px; font-size: 9px; text-align: left; }
        td { border: 1px solid #e5e7eb; padding: 4px 5px; font-size: 9px; vertical-align: top; }
        tr:nth-child(even) td { background: #f8fafc; }
        .center { text-align: center; }
        .muted { color: #6b7280; }
        .empty { padding: 8px; border: 1px dashed #cbd5e1; color: #6b7280; }
        .badge-alta { background: #dcfce7; color: #166534; padding: 1px 5px; border-radius: 3px; font-weight: 700; }
        .badge-baja { background: #fee2e2; color: #991b1b; padding: 1px 5px; border-radius: 3px; font-weight: 700; }
    </style>
</head>
<body>

<div class="header">
    <div class="title">Reporte de Altas y Bajas de Pacientes &mdash; Clínica La Fuente</div>
    <div class="meta">
        Generado: {{ $generadoEn->format('Y-m-d H:i:s') }}<br>
        Período:
        @if($fechaInicio && $fechaFin)
            {{ $fechaInicio }} al {{ $fechaFin }}
        @else
            Todos los registros
        @endif
    </div>
</div>

<div class="summary">
    <b>Altas registradas:</b> {{ $altas->count() }}
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <b>Bajas registradas:</b> {{ $bajas->count() }}
    @if($fechaInicio && $fechaFin)
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <span class="muted">Filtrado por período: {{ $fechaInicio }} — {{ $fechaFin }}</span>
    @endif
</div>

{{-- ALTAS --}}
<div class="section">
    <div class="section-title">Pacientes Dados de Alta</div>
    @if($altas->count())
        <table>
            <thead>
            <tr>
                <th style="width:22px">#</th>
                <th>Paciente</th>
                <th>CI</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Teléfono</th>
                <th>Fecha ingreso</th>
                <th>Registrado por</th>
                <th>Fecha alta</th>
                <th>Dado de alta por</th>
                <th style="width:40px">Estado</th>
            </tr>
            </thead>
            <tbody>
            @foreach($altas as $index => $p)
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    <td>{{ $p->nombre_completo }}</td>
                    <td>{{ $p->identificacion ?: '-' }}</td>
                    <td class="center">{{ $p->edad ?: '-' }}</td>
                    <td>{{ $p->sexo ?: '-' }}</td>
                    <td>{{ $p->telefono ?: '-' }}</td>
                    <td>{{ $p->fecha_creacion ? \Carbon\Carbon::parse($p->fecha_creacion)->format('Y-m-d') : '-' }}</td>
                    <td>{{ $p->registroUser->name ?? '-' }}</td>
                    <td>{{ $p->fecha_alta ? \Carbon\Carbon::parse($p->fecha_alta)->format('Y-m-d H:i') : '-' }}</td>
                    <td>{{ $p->altaUser->name ?? '-' }}</td>
                    <td class="center"><span class="badge-alta">Alta</span></td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <div class="empty">
            @if($fechaInicio && $fechaFin)
                No hay altas registradas en el período seleccionado.
            @else
                No hay pacientes dados de alta.
            @endif
        </div>
    @endif
</div>

{{-- BAJAS --}}
<div class="section">
    <div class="section-title section-title-bajas">Pacientes Dados de Baja (Eliminados)</div>
    @if($bajas->count())
        <table>
            <thead>
            <tr>
                <th style="width:22px">#</th>
                <th>Paciente</th>
                <th>CI</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Teléfono</th>
                <th>Tipo paciente</th>
                <th>Fecha ingreso</th>
                <th>Registrado por</th>
                <th>Fecha baja</th>
                <th style="width:40px">Estado</th>
            </tr>
            </thead>
            <tbody>
            @foreach($bajas as $index => $p)
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    <td>{{ $p->nombre_completo }}</td>
                    <td>{{ $p->identificacion ?: '-' }}</td>
                    <td class="center">{{ $p->edad ?: '-' }}</td>
                    <td>{{ $p->sexo ?: '-' }}</td>
                    <td>{{ $p->telefono ?: '-' }}</td>
                    <td>{{ $p->tipo_paciente ?: '-' }}</td>
                    <td>{{ $p->fecha_creacion ? \Carbon\Carbon::parse($p->fecha_creacion)->format('Y-m-d') : '-' }}</td>
                    <td>{{ $p->registroUser->name ?? '-' }}</td>
                    <td>{{ $p->deleted_at ? \Carbon\Carbon::parse($p->deleted_at)->format('Y-m-d H:i') : '-' }}</td>
                    <td class="center"><span class="badge-baja">Baja</span></td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <div class="empty">
            @if($fechaInicio && $fechaFin)
                No hay bajas registradas en el período seleccionado.
            @else
                No hay pacientes dados de baja.
            @endif
        </div>
    @endif
</div>

</body>
</html>
