<?php

namespace App\Http\Controllers;

use App\Models\HistorialMedico;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class HistorialMedicoController extends Controller{
    function store(Request $request){
        $user = $request->user();
        $request->merge(['user_id' => $user->id]);
        $request->merge(['fecha' => date('Y-m-d H:i:s')]);
        return HistorialMedico::create($request->all());
    }
    public function generatePdf($id)
    {
        $historial = HistorialMedico::with('paciente', 'user')->findOrFail($id);
        $apellidos = $historial->paciente->apellido;
        $partes = explode(' ', $apellidos);

        $apellidoPaterno = $partes[0];
        $apellidoMaterno = isset($partes[1]) ? $partes[1] : '';

        $html = view('pdf.historial', compact('historial', 'apellidoPaterno', 'apellidoMaterno'))->render();

        $pdf = Pdf::loadHTML($html)->setPaper('A4', 'portrait');

        return $pdf->stream('historia_clinica_' . $id . '.pdf');
    }

}
