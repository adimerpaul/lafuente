<?php

namespace App\Http\Controllers;

use App\Models\AntecedentesFamiliare;
use Illuminate\Http\Request;

class AntecedentesFamiliareController extends Controller{
    function store(Request $request){
        $request->merge(['fecha' => now()]);
        $user = auth()->user();
        $request->merge(['user_id' => $user->id]);
        return response()->json(AntecedentesFamiliare::create($request->all()));
    }
}
