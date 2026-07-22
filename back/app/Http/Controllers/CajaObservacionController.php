<?php

namespace App\Http\Controllers;

use App\Models\CajaRecepcion;
use App\Models\CajaObservacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CajaObservacionController extends Controller
{
    public function store(Request $request, CajaRecepcion $cajaRecepcion)
    {
        $data = $request->validate([
            'tipo' => ['required', 'string', Rule::in(CajaRecepcion::COST_FIELDS)],
            'observacion' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('caja-observaciones', 'public');
        }

        $observacion = $cajaRecepcion->observaciones()->create([
            'tipo' => $data['tipo'],
            'observacion' => $data['observacion'],
            'foto_path' => $fotoPath,
            'user_id' => auth()->id(),
        ]);

        return response()->json($observacion->load('user'), 201);
    }

    public function show(CajaRecepcion $cajaRecepcion)
    {
        return response()->json(
            $cajaRecepcion->observaciones()->with('user')->latest()->get()
        );
    }

    public function destroy(CajaRecepcion $cajaRecepcion, CajaObservacion $observacion)
    {
        if ($observacion->caja_recepcion_id !== $cajaRecepcion->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        if ($observacion->foto_path) {
            Storage::disk('public')->delete($observacion->foto_path);
        }

        $observacion->delete();

        return response()->json(null, 204);
    }
}
