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
        .border{
            border: 1px solid #000;
            padding: 0;
            margin: 3px;
            border-radius: 5px;
        }
        .circle {
            width: 100px;
            height: 100px;
            margin: 3px;
            border-radius: 50%;
            border: 1px solid #000;
        }
    </style>
</head>
<body>
<br>
<div class="center text-bold h1 lineHeight">
    <br>
    HISTORIA MEDICO<br>
    CONSULTA EXTERNA
</div>
<div class="text-right" style="height: 30px;">
    <div style="width: 100px; float: right;border-radius: 5px; border: 1px solid #D3D3D3; padding: 3px;text-align: left;background: #D3D3D3;">
        N° H.CL: {{ $historial->id }}
    </div>
</div>
<div class="border">
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
<table style="border: 0;padding: 0;margin: 0;">
    <tr>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                Fecha de Nacimiento: {{ $historial->paciente->fecha_nacimiento }}
            </div>
        </td>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                Sexo:
                <span class="{{ $historial->paciente->sexo == 'M' ? 'circle' : '' }}">
                    M
                </span>
                <span class="{{ $historial->paciente->sexo == 'F' ? 'circle' : '' }}">
                    F
                </span>
            </div>
        </td>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                Estado Civil: {{ $historial->paciente->estado_civil }}
            </div>
        </td>
    </tr>
</table>
<table style="border: 0;padding: 0;margin: 0;">
    <tr>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                C.I. - RUN: {{ $historial->paciente->identificacion }}
            </div>
        </td>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                Dirección: {{ $historial->paciente->direccion }}
            </div>
        </td>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                Teléfono: {{ $historial->paciente->telefono }}
            </div>
        </td>
    </tr>
</table>
<table class="border" style="border-radius: 5px;">
    <tr>
        <td class="lineHeight" >
            <div  style="padding: 3px">
                Edad:
                @php
                    if($historial->paciente->fecha_nacimieto){
                        $fechaNacimiento = new DateTime($historial->paciente->fecha_nacimiento);
                        $fechaActual = new DateTime();
                        $edad = $fechaNacimiento->diff($fechaActual);
                        echo $edad->y;
                    }else{
                        echo $historial->paciente->edad;
                    }
                @endphp
            </div>
        </td>
        <td class="lineHeight" >
            <div  style="padding: 3px">
                Fecha de atención: {{ substr($historial->fecha, 0, 10) }}
            </div>
        </td>
        <td class="lineHeight" >
            <div  style="padding: 3px">
                Hora de atención: {{ substr($historial->fecha, 11, 5) }}
            </div>
        </td>
        <td class="lineHeight" >
            <div  style="padding: 3px">
                Referido de: {{ $historial->referido_de }}
            </div>
        </td>
    </tr>
</table>
<div class="border" style="padding: 3px">
    <b>MOTIVO DE CONSULTA. (Síntomas, signos, causas y tiempo de evolución). </b><br>
    {{ $historial->motivo_consulta }} <br>
    <b>Enfermedad Actual: </b><br>
    {{ $historial->enfermedad_actual }} <br>
    <b>Alergias Conocidas: </b><br>
    {{ $historial->alergias_conocidas }}
</div>

{{--{--}}
{{--"id": 1,--}}
{{--"nombre": "Marcos",--}}
{{--"apellido": "Carreón",--}}
{{--"fecha_nacimiento": "1983-04-27",--}}
{{--"identificacion": "624079258",--}}
{{--"edad": 72,--}}
{{--"sexo": "F",--}}
{{--"estado_civil": "Soltero",--}}
{{--"direccion": "Camino Alejandro, 37, Ático 7º, 79494, O Meléndez de las Torres",--}}
{{--"telefono": "915342948",--}}
{{--"fecha_creacion": "2024-11-16 06:28:18",--}}
{{--"nombre_completo": "Marcos Carreón",--}}
{{--"historial_medicos": [--}}
{{--{--}}
{{--"id": 1,--}}
{{--"paciente_id": 1,--}}
{{--"user_id": 1,--}}
{{--"fecha": "2004-01-05 23:00:57",--}}
{{--"referido_de": "Oliva-Cervantes y Asoc.",--}}
{{--"motivo_consulta": "Porro ab sunt eum quidem.",--}}
{{--"enfermedad_actual": "Voluptatem natus itaque quas.",--}}
{{--"alergias_conocidas": "Unde itaque ut id qui.",--}}
{{--"user": {--}}
{{--"id": 1,--}}
{{--"name": "Adminstrador",--}}
{{--"username": "admin",--}}
{{--"email": "admin@test.com",--}}
{{--"role": "Doctor",--}}
{{--"color": "orange"--}}
{{--}--}}
{{--},--}}
{{--{--}}
{{--"id": 2,--}}
{{--"paciente_id": 1,--}}
{{--"user_id": 1,--}}
{{--"fecha": "2024-11-16 00:00:00",--}}
{{--"referido_de": null,--}}
{{--"motivo_consulta": null,--}}
{{--"enfermedad_actual": null,--}}
{{--"alergias_conocidas": null,--}}
{{--"user": {--}}
{{--"id": 1,--}}
{{--"name": "Adminstrador",--}}
{{--"username": "admin",--}}
{{--"email": "admin@test.com",--}}
{{--"role": "Doctor",--}}
{{--"color": "orange"--}}
{{--}--}}
{{--},--}}
{{--{--}}
{{--"id": 3,--}}
{{--"paciente_id": 1,--}}
{{--"user_id": 1,--}}
{{--"fecha": "2024-11-16 00:00:00",--}}
{{--"referido_de": "asda",--}}
{{--"motivo_consulta": "asda",--}}
{{--"enfermedad_actual": "adasd",--}}
{{--"alergias_conocidas": "adasdsa",--}}
{{--"user": {--}}
{{--"id": 1,--}}
{{--"name": "Adminstrador",--}}
{{--"username": "admin",--}}
{{--"email": "admin@test.com",--}}
{{--"role": "Doctor",--}}
{{--"color": "orange"--}}
{{--}--}}
{{--},--}}
{{--{--}}
{{--"id": 4,--}}
{{--"paciente_id": 1,--}}
{{--"user_id": 1,--}}
{{--"fecha": "2024-11-16 00:00:00",--}}
{{--"referido_de": "referido de",--}}
{{--"motivo_consulta": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",--}}
{{--"enfermedad_actual": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",--}}
{{--"alergias_conocidas": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",--}}
{{--"user": {--}}
{{--"id": 1,--}}
{{--"name": "Adminstrador",--}}
{{--"username": "admin",--}}
{{--"email": "admin@test.com",--}}
{{--"role": "Doctor",--}}
{{--"color": "orange"--}}
{{--}--}}
{{--},--}}
{{--{--}}
{{--"id": 5,--}}
{{--"paciente_id": 1,--}}
{{--"user_id": 1,--}}
{{--"fecha": "2024-11-16 07:59:00",--}}
{{--"referido_de": "referido del doctor",--}}
{{--"motivo_consulta": "motivo de la contata",--}}
{{--"enfermedad_actual": "asda",--}}
{{--"alergias_conocidas": "asdas",--}}
{{--"user": {--}}
{{--"id": 1,--}}
{{--"name": "Adminstrador",--}}
{{--"username": "admin",--}}
{{--"email": "admin@test.com",--}}
{{--"role": "Doctor",--}}
{{--"color": "orange"--}}
{{--}--}}
{{--}--}}
{{--],--}}
{{--"signos_vitales": [--}}
{{--{--}}
{{--"id": 1,--}}
{{--"paciente_id": 1,--}}
{{--"estado_general": "Enim distinctio molestiae quo qui vitae nam blanditiis.",--}}
{{--"fc": 90,--}}
{{--"fr": 16,--}}
{{--"pa": 95,--}}
{{--"temperatura": "35.03",--}}
{{--"peso": "119.78",--}}
{{--"talla": "2.09",--}}
{{--"imc": "16.57",--}}
{{--"spo2": 93,--}}
{{--"glasgow": 5--}}
{{--}--}}
{{--],--}}
{{--"antecedentes_familiares": [--}}
{{--{--}}
{{--"id": 1,--}}
{{--"paciente_id": 1,--}}
{{--"tuberculosis": 1,--}}
{{--"diabetes": 1,--}}
{{--"hipertension": 0,--}}
{{--"cardiopatia": 0--}}
{{--}--}}
{{--],--}}
{{--"habitos_personales": [--}}
{{--{--}}
{{--"id": 1,--}}
{{--"paciente_id": 1,--}}
{{--"fuma": 0,--}}
{{--"alcohol": 1,--}}
{{--"drogas": 1,--}}
{{--"zoonosis": 0,--}}
{{--"deportes": 1,--}}
{{--"vacunas": 1--}}
{{--}--}}
{{--]--}}
{{--}--}}
{{--css floating bototm--}}
<div style="position: absolute; bottom: 34px; width: 550px; text-align: center;right: 20px;">
    <table>
        <tr>
            <td style="height: 50px;text-align: center;width: 50px">Atendido por:</td>
            <td style="height: 50px;text-align: center;width: 150px" valign="bottom">Firma</td>
            <td style="height: 50px;text-align: center;width: 150px" valign="bottom">Sello</td>
        </tr>
    </table>
</div>
</body>
</html>
