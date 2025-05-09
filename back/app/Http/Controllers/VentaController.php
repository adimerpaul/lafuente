<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Receta;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller{
    function anular(Request $request, $id){
        $venta = Venta::findOrFail($id);
        $venta->update(['estado' => 'Anulada']);
        return $venta;
    }
    function tipoVentasChange(Request $request, $id){
        $venta = Venta::findOrFail($id);
        $tipo_venta = $venta->tipo_venta;
        if ($tipo_venta == 'Interno') {
            $venta->tipo_venta = 'Externo';
            $venta->save();
        } else {
            $venta->tipo_venta = 'Interno';
            $venta->save();
        }
        return $venta;
    }
    function store(Request $request){
        DB::beginTransaction();
        try {
            $cliente = $this->clienteUpdateOrCreate($request);

            $request->merge(['user_id' => auth()->user()->id,]);
            $request->merge(['cliente_id' => $cliente->id,]);
            $request->merge(['fecha' => date('Y-m-d'),]);
            $request->merge(['hora' => date('H:i:s'),]);
            $venta = Venta::create($request->all());
            $productos = $request->productos;
            $insertProductos = [];
            $total = 0;
            foreach ($productos as $producto) {
                $insertProductos[] = [
                    'venta_id' => $venta->id,
                    'producto_id' => $producto['producto_id'],
                    'cantidad' => $producto['cantidad'],
                    'precio' => $producto['precio'],
                ];
                $total += $producto['cantidad'] * $producto['precio'];

                $productoFind = Producto::findOrFail($producto['producto_id']);
                if ($productoFind->stock > 0) {
                    $productoFind->stock -= $producto['cantidad'];
                    $productoFind->save();
                }
            }
            $venta->update(['total' => $total]);
            $receta_id = $request->receta_id;
            if ($receta_id != '') {
                error_log('receta_id: ' . $receta_id);
                $receta = Receta::findOrFail($receta_id);
                $receta->numero_factura = $venta->id;
                $receta->save();
            }
            $venta->ventaDetalles()->createMany($insertProductos);

            DB::commit();
            return Venta::with('user', 'ventaDetalles.producto')->findOrFail($venta->id);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Error al guardar la venta: ' . $e->getMessage()], 500);
        }
    }
    function clienteUpdateOrCreate($request){
        $ci = $request->ci;
        $findCliente = Cliente::where('ci', $ci)->first();
        if ($findCliente) {
            $findCliente->update($request->all());
            return $findCliente;
        } else {
            return Cliente::create($request->all());
        }
    }
    function index(Request $request){
        $fechaInicio = $request->fechaInicio;
        $fechaFin = $request->fechaFin;
        $user = $request->user;

        $ventas = Venta::with('user', 'cliente')
            ->whereBetween('fecha', [$fechaInicio, $fechaFin])
            ->orderBy('created_at', 'desc')
            ->get();
        if ($user != '') {
            $ventas = $ventas->where('user_id', $user);
        }
        return $ventas;
    }
    function show($id){
        return Venta::with('user', 'cliente')->findOrFail($id);
    }
    function update(Request $request, $id){
        $venta = Venta::findOrFail($id);
        $venta->update($request->all());
        return $venta;
    }
    function destroy($id){
        $venta = Venta::findOrFail($id);
        $venta->delete();
        return $venta;
    }
}
