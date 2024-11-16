<?php

namespace App\Http\Controllers;

use App\Models\HistorialMedico;
use Illuminate\Http\Request;

class HistorialMedicoController extends Controller{
    function store(Request $request){
        $user = $request->user();
        $request->merge(['user_id' => $user->id]);
        $request->merge(['fecha' => date('Y-m-d H:i:s')]);
        return HistorialMedico::create($request->all());
    }
}
