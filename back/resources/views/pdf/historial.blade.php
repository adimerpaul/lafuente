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
            background-image: url('{{ public_path("fondo.png") }}');
            background-size: cover; /* Ajusta la imagen para cubrir el área */
            background-repeat: no-repeat; /* Evita que la imagen se repita */
            background-attachment: fixed; /* Fija el fondo durante el desplazamiento */
            background-position: center; /* Centra la imagen */
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
            /*padding: 5px;*/
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
        .h1 {
            font-size: 24px;
        }
        .h2 {
            font-size: 20px;
        }
        .h3 {
            font-size: 16px;
        }
        .lineHeight {
            line-height: 0.9;
        }
        .text-right {
            text-align: right;
        }
        .w-100 {
            width: 100px;
        }
    </style>
</head>
<body>
<br>
<div class="center text-bold h1 lineHeight">
    <br>
    HISTORIA CLÍNICA<br>
    CONSULTA EXTERNA
</div>
<div class="text-right" style="height: 30px;">
    <div style="width: 100px; float: right;border-radius: 5px; border: 1px solid #D3D3D3; padding: 3px;text-align: left;background: #D3D3D3;">
        N° H.CL: {{ $historial->id }}
    </div>
</div>
<div style="border: 1px solid #000;text-align: left;padding: 0;margin: 0;border-radius: 5px;">
    <table style="border: 0;padding: 0;margin: 0;">
        <tr>
            <td class="center lineHeight" style="border: 0" >
                <br>
                {{ $apellidoPaterno }}
                <br>
                ---------------------------- <br>
                Apellido Paterno
            </td>
            <td class="center lineHeight" style="border: 0" >
                <br>
                {{ $apellidoMaterno }}
                <br>
                ---------------------------- <br>
                Apellido Materno
            </td>
            <td class="center lineHeight" style="border: 0" >
                <br>
                {{ $historial->paciente->nombre }}
                <br>
                ---------------------------- <br>
                Nombres
            </td>
        </tr>
    </table>
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
