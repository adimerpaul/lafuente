<?php

namespace App\Http\Controllers;

use App\Models\PacienteFoto;
use Illuminate\Http\Request;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class PacienteFotoController extends Controller {

    function index(Request $request) {
        return PacienteFoto::with('user')
            ->where('paciente_id', $request->paciente_id)
            ->orderByDesc('created_at')
            ->get();
    }

    function store(Request $request) {
        $request->validate([
            'file'       => 'required|image|max:20480',
            'paciente_id' => 'required|exists:pacientes,id',
        ]);

        $carpeta = public_path('fotos-pacientes');
        if (!file_exists($carpeta)) {
            mkdir($carpeta, 0777, true);
        }

        $fileName = uniqid('pfoto_') . '.webp';

        $manager = new ImageManager(new Driver());
        $image   = $manager->read($request->file('file'));

        if ($image->width() > 1200) {
            $image->scale(width: 1200);
        }

        $image->toWebp(quality: 72)->save($carpeta . '/' . $fileName);

        $foto = PacienteFoto::create([
            'paciente_id' => $request->paciente_id,
            'user_id'     => auth()->id(),
            'archivo'     => $fileName,
        ]);

        return response()->json($foto->load('user'), 201);
    }

    function destroy(PacienteFoto $pacienteFoto) {
        $filePath = public_path('fotos-pacientes/' . $pacienteFoto->archivo);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        $pacienteFoto->delete();
        return response()->json($pacienteFoto);
    }
}
