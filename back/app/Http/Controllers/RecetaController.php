<?php

namespace App\Http\Controllers;

use App\Models\HistorialMedico;
use App\Models\Receta;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class RecetaController extends Controller{
    function show($id){
        return Receta::with('recetaDetalles.producto')->where('id', $id)->first();
    }
    function store(Request $request){
        $request->merge(['user_id' => auth()->user()->id,]);
        $request->merge(['fecha' => date('Y-m-d H:i:s'),]);
        $receta = Receta::create($request->all());
        $productos = $request->productos;
        $productosInsert = [];
        foreach ($productos as $producto) {
            $productosInsert[] = [
                'receta_id' => $receta->id,
                'producto_id' => $producto['producto_id'],
                'cantidad' => $producto['cantidad'],
                'productoNombre' => $this->textUppercase($producto['producto']['nombre']),
                'unidad' => $producto['unidad'],
                'via' => $producto['via'],
                'frecuencia' => $producto['frecuencia'],
                'duracion' => $producto['duracion'],
                'indicaciones' => $producto['indicaciones'],
            ];
        }
        $receta->recetaDetalles()->createMany($productosInsert);
    }
    function textUppercase($text){
        $lower = strtolower($text); // Convierte todo el texto a minúsculas
        $capitalized = ucfirst($lower); // Convierte la primera letra en mayúscula
        return $capitalized;
    }
    function generatePdf($id)
    {
        $receta = Receta::where('id', $id)->first();
//        return $receta;
        $paciente = $receta->paciente;

        $apellidos = $paciente->apellido;
        $partes = explode(' ', $apellidos);
        $apellidoPaterno = $partes[0];
        $apellidoMaterno = isset($partes[1]) ? $partes[1] : '';

//        $html = view('pdf.receta', compact('receta', 'apellidoPaterno', 'apellidoMaterno', 'paciente'))->render();

//        $pdf = Pdf::loadHTML($html)->setPaper([0, 0, 396, 612], 'portrait'); // 396x612 puntos = 5.5x8.5 pulgadas

//        hoja tamaño carta horizontal
        $pdf = Pdf::loadView('pdf.receta', compact('receta', 'apellidoPaterno', 'apellidoMaterno', 'paciente'))
            ->setPaper('letter', 'landscape');
//            ->setPaper('half-letter');  // Formato media carta

        return $pdf->stream('receta' . $id . '.pdf');
    }
}
