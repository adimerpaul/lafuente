<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;

class CompraController extends Controller
{
    public function index(Request $request)
    {
        $query = Compra::with(['user', 'proveedor', 'compraDetalles.producto']);

        if ($request->fechaInicio && $request->fechaFin) {
            $query->whereBetween('fecha', [$request->fechaInicio, $request->fechaFin]);
        }

        if ($request->user) {
            $query->where('user_id', $request->user);
        }

        return $query->orderByDesc('fecha')->get();
    }

    public function anular($id)
    {
        $compra = Compra::findOrFail($id);
        $compra->estado = 'Anulado';
        $compra->save();

        return response()->json(['message' => 'Compra anulada correctamente']);
    }
}
