<?php

namespace App\Http\Controllers;

use App\Models\HabitosPersonale;
use Illuminate\Http\Request;

class HabitosPersonaleController extends Controller{
    function store(Request $request){
        $request->merge(['fecha' => now()]);
        $user = auth()->user();
        $request->merge(['user_id' => $user->id]);
        return response()->json(HabitosPersonale::create($request->all()));
    }
}
