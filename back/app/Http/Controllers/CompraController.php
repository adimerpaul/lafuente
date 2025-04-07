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
    public function store(Request $request)
    {
        $request->merge([
            'user_id' => auth()->id(),
            'fecha' => date('Y-m-d'),
            'hora' => date('H:i:s'),
            'estado' => 'Registrado',
            'total' => 0,
        ]);

        $compra = Compra::create($request->only([
            'user_id', 'proveedor_id', 'fecha', 'hora', 'ci', 'nombre', 'estado', 'tipo_pago'
        ]));

        $productos = $request->productos;
        $insert = [];
        $total = 0;

        foreach ($productos as $producto) {
            $subtotal = $producto['precio'] * $producto['cantidad'];
            $insert[] = [
                'compra_id' => $compra->id,
                'producto_id' => $producto['producto_id'],
                'cantidad' => $producto['cantidad'],
                'precio' => $producto['precio'],
                'total' => $subtotal,
                'estado' => 'Registrado',
            ];
            $total += $subtotal;
        }

        $compra->update(['total' => $total]);
        $compra->compraDetalles()->createMany($insert);

        return Compra::with(['compraDetalles.producto', 'proveedor', 'user'])->find($compra->id);
    }

}
