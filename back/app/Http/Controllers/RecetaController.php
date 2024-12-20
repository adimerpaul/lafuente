<?php

namespace App\Http\Controllers;

use App\Models\Receta;
use Illuminate\Http\Request;

class RecetaController extends Controller{
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
}
