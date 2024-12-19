<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historia Clínica</title>
    <style>
        * {
            font-family: Arial, sans-serif;
            padding: 0;
            margin: 0;
            border: 0;
        }
        body {
            font-size: 12px;
            line-height: 1.5;
            margin: 20px;
        }
        h1, h2, h3 {
            text-align: center;
            margin-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        table th, table td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }
        .section {
            margin-bottom: 15px;
        }
        .header {
            text-align: center;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .text-bold {
            font-weight: bold;
        }
        .center {
            text-align: center;
        }
    </style>
</head>
<body>
<div class="center text-bold">Historia Clínica - Consulta Externa</div>
<div class="center text-bold">Número de Historia Clínica: {{ $historial->id }}
</div>

<div class="section font-style-script">
    <div class="font-style-script">Datos del Paciente</div>
    <table>
        <tr>
            <th colspan="2">
                <div>Datos del Pacientes</div>
            </th>
        </tr>
        <tr>
            <td><span class="text-bold">Nombre Completo:</span> {{ $historial->paciente->nombre_completo }}</td>
            <td><span class="text-bold">Fecha de Nacimiento:</span> {{ $historial->paciente->fecha_nacimiento }}</td>
        </tr>
        <tr>
            <td><span class="text-bold">Edad:</span> {{ $historial->paciente->edad }}</td>
            <td><span class="text-bold">Sexo:</span> {{ $historial->paciente->sexo }}</td>
        </tr>
        <tr>
            <td><span class="text-bold">Dirección:</span> {{ $historial->paciente->direccion }}</td>
            <td><span class="text-bold">Teléfono:</span> {{ $historial->paciente->telefono }}</td>
        </tr>
    </table>
</div>

<div class="section">
    <table>
        <tr>
            <th colspan="2">Información Médica</th>
        </tr>
        <tr>
            <td><span class="text-bold">Referido de:</span> {{ $historial->referido_de }}</td>
            <td><div style="">{{'Motivo de Consulta'}}:</div> {{ $historial->motivo_consulta }}</td>
        </tr>
        <tr>
            <td colspan="2"><span class="text-bold"><b>Enfermedad Actual:</span> {{ $historial->enfermedad_actual }}</td>
        </tr>
        <tr>
            <td colspan="2"><span class="text-bold">Alergias Conocidas:</span> {{ $historial->alergias_conocidas }}</td>
        </tr>
    </table>
</div>

<div class="section">
    <table>
        <tr>
            <th>Fecha de Creación</th>
            <th>Creado por</th>
        </tr>
        <tr>
            <td>{{ $historial->fecha }}</td>
            <td>{{ $historial->user->name }}</td>
        </tr>
    </table>
</div>

<div class="section">
    <h3>Diagnósticos y Observaciones</h3>
    <p>Información adicional o diagnósticos específicos pueden incluirse aquí, según los datos disponibles.</p>
</div>
</body>
</html>
