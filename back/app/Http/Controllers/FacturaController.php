<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use Illuminate\Http\Request;

class FacturaController extends Controller{
    function store(Request $request){
        $user = $request->user();

        $cobro = new Factura();
        $cobro->fecha = date('Y-m-d H:i:s');
        $cobro->observacion = $request->observacion;
        $cobro->tipo = $request->tipo;
        $cobro->total = $request->total;
        $cobro->paciente_id = $request->paciente_id;
        $cobro->user_id = $user->id;
        $cobro->save();
        return response()->json($cobro);
    }
    function update(Request $request, Factura $factura){
        $factura->update($request->all());
        return response()->json($factura);
    }
}
