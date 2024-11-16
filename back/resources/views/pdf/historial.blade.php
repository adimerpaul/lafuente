<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historia Clínica</title>
    <style>
        * {
            padding: 0;
            margin: 0;
            border: 0;
        }
        body {
            font-family: Arial, sans-serif;
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
    </style>
</head>
<body>
<h1>Historia Clínica - Consulta Externa</h1>
<h3>Número de Historia Clínica: {{ $historial->id }}</h3>

<div class="section">
    <table>
        <tr>
            <th colspan="2">Datos del Paciente</th>
        </tr>
        <tr>
            <td><strong>Nombre Completo:</strong> {{ $historial->paciente->nombre_completo }}</td>
            <td><strong>Fecha de Nacimiento:</strong> {{ $historial->paciente->fecha_nacimiento }}</td>
        </tr>
        <tr>
            <td><strong>Edad:</strong> {{ $historial->paciente->edad }}</td>
            <td><strong>Sexo:</strong> {{ $historial->paciente->sexo }}</td>
        </tr>
        <tr>
            <td><strong>Dirección:</strong> {{ $historial->paciente->direccion }}</td>
            <td><strong>Teléfono:</strong> {{ $historial->paciente->telefono }}</td>
        </tr>
    </table>
</div>

<div class="section">
    <table>
        <tr>
            <th colspan="2">Información Médica</th>
        </tr>
        <tr>
            <td><strong>Referido de:</strong> {{ $historial->referido_de }}</td>
            <td><strong>Motivo de Consulta:</strong> {{ $historial->motivo_consulta }}</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Enfermedad Actual:</strong> {{ $historial->enfermedad_actual }}</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Alergias Conocidas:</strong> {{ $historial->alergias_conocidas }}</td>
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
