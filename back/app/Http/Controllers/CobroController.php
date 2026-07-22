<?php

namespace App\Http\Controllers;

use App\Models\Cobro;
use Illuminate\Http\Request;

class CobroController extends Controller{
    function store(Request $request){

        $user = $request->user();

        $cobro = new Cobro();
        $cobro->fecha = date('Y-m-d H:i:s');
        $cobro->observacion = $request->observacion;
        $cobro->tipo = $request->tipo;
        $cobro->total = $request->total;
        $cobro->paciente_id = $request->paciente_id;
        $cobro->user_id = $user->id;
        $cobro->save();
        return response()->json($cobro);
    }
    function update(Request $request, Cobro $cobro){
        $cobro->update($request->all());
        return response()->json($cobro);
    }
}
