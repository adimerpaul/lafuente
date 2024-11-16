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
        // Obtener el historial médico por ID
        $historial = HistorialMedico::with('paciente', 'user')->findOrFail($id);

        // Crear el contenido HTML para el PDF
        $html = view('pdf.historial', compact('historial'))->render();

        // Generar el PDF
        $pdf = Pdf::loadHTML($html)->setPaper('A4', 'portrait');

        // Descargar el PDF
        return $pdf->stream('historia_clinica_' . $id . '.pdf');
    }

}
