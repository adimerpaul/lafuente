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
    RECETA MEDICA<br>
    CONSULTA EXTERNA
</div>
<div class="text-right" style="height: 30px;">
    <div style="width: 100px; float: right;border-radius: 5px; border: 1px solid #D3D3D3; padding: 3px;text-align: left;background: #D3D3D3;">
        N° H.CL: {{ $paciente->id }}
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
                {{ $paciente->nombre }}
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
                Fecha de Nacimiento: {{ $paciente->fecha_nacimiento }}
            </div>
        </td>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                Sexo:
                <span class="{{ $paciente->sexo == 'M' ? 'circle' : '' }}">
                    M
                </span>
                <span class="{{ $paciente->sexo == 'F' ? 'circle' : '' }}">
                    F
                </span>
            </div>
        </td>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                Estado Civil: {{ $paciente->estado_civil }}
            </div>
        </td>
    </tr>
</table>
<table style="border: 0;padding: 0;margin: 0;">
    <tr>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                C.I. - RUN: {{ $paciente->identificacion }}
            </div>
        </td>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                Dirección: {{ $paciente->direccion }}
            </div>
        </td>
        <td class="lineHeight" style="border: 0" >
            <div class="border" style="padding: 3px">
                Teléfono: {{ $paciente->telefono }}
            </div>
        </td>
    </tr>
</table>
{{--"receta_detalles": [--}}
{{--{--}}
{{--"id": 1,--}}
{{--"receta_id": 1,--}}
{{--"producto_id": 510,--}}
{{--"cantidad": 1,--}}
{{--"unidad": "pastilla",--}}
{{--"productoNombre": "Paracetamol",--}}
{{--"via": "oral",--}}
{{--"frecuencia": "cada 8 horas",--}}
{{--"duracion": "3 dias",--}}
{{--"indicaciones": "Tomar con agua",--}}
{{--"producto": {--}}
{{--"id": 510,--}}
{{--"nombre": "RETINOX 500 MG X COMP. RECUB.",--}}
{{--"descripcion": "Antifibrinolítico",--}}
{{--"unidad": "COMPRIMIDOS RECUBIERTOS",--}}
{{--"precio": 14,--}}
{{--"stock": null,--}}
{{--"stock_minimo": null,--}}
{{--"stock_maximo": null--}}
{{--}--}}
{{--},--}}

<table style="border: 0;padding: 0;margin: 0;">
    <tr style="border: 0;padding: 0;margin: 0;">
        <th style="border: 0;padding: 0;margin: 0;">
            Producto
        </th>
        <th style="border: 0;padding: 0;margin: 0;">
            Cantidad
        </th>
        <th style="border: 0;padding: 0;margin: 0;">
            Unidad
        </th>
        <th style="border: 0;padding: 0;margin: 0;">
            Via
        </th>
        <th style="border: 0;padding: 0;margin: 0;">
            Frecuencia
        </th>
        <th style="border: 0;padding: 0;margin: 0;">
            Duración
        </th>
        <th style="border: 0;padding: 0;margin: 0;">
            Indicaciones
        </th>
    </tr>
    @foreach($receta->recetaDetalles as $receta_detalle)
        <tr>
            <td style="border: 0;padding: 0;margin: 0;">
                {{ $receta_detalle->productoNombre }}
            </td>
            <td style="border: 0;padding: 0;margin: 0;">
                {{ $receta_detalle->cantidad }}
            </td>
            <td style="border: 0;padding: 0;margin: 0;">
                {{ $receta_detalle->unidad }}
            </td>
            <td style="border: 0;padding: 0;margin: 0;">
                {{ $receta_detalle->via }}
            </td>
            <td style="border: 0;padding: 0;margin: 0;">
                {{ $receta_detalle->frecuencia }}
            </td>
            <td style="border: 0;padding: 0;margin: 0;">
                {{ $receta_detalle->duracion }}
            </td>
            <td style="border: 0;padding: 0;margin: 0;">
                {{ $receta_detalle->indicaciones }}
            </td>
        </tr>
    @endforeach
</table>
{{--{{$receta->recetaDetalles}}--}}


<div style="position: absolute; bottom: 35px; width: 100%; text-align: center; right: 20px; line-height: 1.2; font-size: 9px; font-family: Arial, sans-serif;">
    <p style="margin: 0;">
        <strong>Servicios de:</strong> Medicina General, Ginecología y Obstetricia, Medicina Interna, Cirugía General, Pediatría, <br>
        Neonatología, Traumatología y Ortopedia, Medicina Crítica, Odontología, Ecografía, Rayos X, Laboratorio, Farmacia.
    </p>
    <p style="margin: 5px 0;">
        <strong>Dirección:</strong> Calle Beni Nro. 60, entre 6 de Octubre y Potosí.
    </p>
    <div style="text-align: center; background: #018C86; padding: 5px; color: #fff; border-radius: 3px; margin-top: 5px;">
        <strong>Teléfonos:</strong> 25247993 - 76148555 <br>
        <strong>Clínica La Fuente:</strong> @clinica.lafuente <br>
        <strong>Correo:</strong> medicos.islafuente@gmail.com
    </div>
</div>
</body>
</html>
