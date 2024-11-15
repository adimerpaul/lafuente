<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;

class PacienteController extends Controller{
    function index(Request $request) {
        $search = $request->search;

        $pacientes = Paciente::where(function ($query) use ($search) {
            $query->where('nombre', 'like', "%$search%")
                ->orWhere('apellido', 'like', "%$search%")
                ->orWhere('identificacion', 'like', "%$search%")
                ->orWhereRaw('CONCAT(nombre, " ", apellido) LIKE ?', ["%$search%"])
                ->orWhereRaw('CONCAT(apellido, " ", nombre) LIKE ?', ["%$search%"]);
        })
            ->orderBy('nombre')
            ->orderBy('apellido')
            ->paginate(15);

        return response()->json($pacientes);
    }
    function store(Request $request){
        $request->merge(['fecha_creacion' => now()]);
        return response()->json(Paciente::create($request->all()));
    }
    function show(Paciente $paciente){
        return Paciente::with('historialMedicos','signosVitales','antecedentesFamiliares','habitosPersonales')->find($paciente->id);
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
