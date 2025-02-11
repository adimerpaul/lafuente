<?php

namespace App\Http\Controllers;

use App\Models\PacienteVenta;
use App\Models\Venta;
use Illuminate\Http\Request;

class PacienteVentaController extends Controller{
    function store(Request $request){
//        verificar que ecista le venta
        $venta = Venta::find($request->venta_id);
        if(!$venta){
            return response()->json(['message' => 'La venta no existe'], 404);
        }
        $user = $request->user();
        $pacienteVenta = new PacienteVenta();
        $pacienteVenta->paciente_id = $request->paciente_id;
        $pacienteVenta->venta_id = $request->venta_id;
        $pacienteVenta->user_id = $user->id;
        $hora = date('H:i');
        $pacienteVenta->hora = $hora;
        $pacienteVenta->save();
        return response()->json($pacienteVenta);
    }
    function destroy(PacienteVenta $paciente_venta){
        $paciente_venta->delete();
        return response()->json($paciente_venta);
    }
}
