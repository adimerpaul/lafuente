<?php

namespace App\Http\Controllers;

use App\Models\SignosVitale;
use Illuminate\Http\Request;

class SignosVitaleController extends Controller{
    public function store(Request $request){
        $user = $request->user();
        $request->merge(['fecha' => now()]);
        $request->merge(['user_id' => $user->id]);
        return response()->json(SignosVitale::create($request->all()));
    }
}
