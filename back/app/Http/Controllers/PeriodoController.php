<?php

namespace App\Http\Controllers;

use App\Models\Periodo;
use Illuminate\Http\Request;

class PeriodoController extends Controller{
    function periodosActivos(){
        $now = date('Y-m-d');
        return Periodo::where('fecha_inicio', '<=', $now)->where('fecha_fin', '>=', $now)->get();
    }
    function index(Request $request){
        return Periodo::orderBy('id', 'desc')->get();
    }
    function store(Request $request){
        $periodo = Periodo::where('periodo', $request->periodo)->first();
        if($periodo){
            return response()->json([
                'message' => 'El periodo ya existe',
            ], 400);
        }
        return Periodo::create($request->all());
    }
    function update(Request $request, Periodo $periodo){
        $periodoFind = Periodo::where('periodo', $request->periodo)->where('id', '!=', $periodo->id)->first();
        if($periodoFind){
            return response()->json([
                'message' => 'El periodo ya existe',
            ], 400);
        }
        $periodo->update($request->all());
        return $periodo;
    }
    function destroy(Periodo $periodo){
        $periodo->delete();
        return $periodo;
    }
}
