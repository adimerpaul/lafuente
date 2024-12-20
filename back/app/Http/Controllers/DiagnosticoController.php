<?php

namespace App\Http\Controllers;

use App\Models\Diagnostico;
use Illuminate\Http\Request;

class DiagnosticoController extends Controller{
    function store(Request $request){
        $request->merge(['fecha_creacion' => now()]);
        $user = auth()->user();
        $request->merge(['user_id' => $user->id]);
        return response()->json(Diagnostico::create($request->all()));
    }
}
