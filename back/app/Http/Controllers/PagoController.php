<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use Illuminate\Http\Request;

class PagoController extends Controller{
    function store(Request $request){
        $user = $request->user();

        $cobro = new Pago();
        $cobro->fecha = date('Y-m-d H:i:s');
        $cobro->observacion = $request->observacion;
        $cobro->tipo = $request->tipo;
        $cobro->total = $request->total;
        $cobro->paciente_id = $request->paciente_id;
        $cobro->user_id = $user->id;
        $cobro->save();
        return response()->json($cobro);
    }
    function update(Request $request, Pago $pago){
        $pago->update($request->all());
        return response()->json($pago);
    }
}
