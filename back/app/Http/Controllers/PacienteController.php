<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;

class PacienteController extends Controller{
    function index(Request $request){
        $search = $request->search;
        $pacientes = Paciente::where('nombre', 'like', "%$search%")
            ->orWhere('apellido', 'like', "%$search%")
            ->orWhere('identificacion', 'like', "%$search%")
            ->orderBy('nombre')
            ->orderBy('apellido')
            ->paginate(15);
        return response()->json($pacientes);
    }
    function store(Request $request){
        return response()->json(Paciente::create($request->all()));
    }
    function show(Paciente $paciente){
        return response()->json($paciente);
    }
    function update(Request $request, Paciente $paciente){
        $paciente->update($request->all());
        return response()->json($paciente);
    }
    function destroy(Paciente $paciente){
        $paciente->delete();
        return response()->json($paciente);
    }
}
