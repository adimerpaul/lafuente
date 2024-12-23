<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Venta;
use Illuminate\Http\Request;

class VentaController extends Controller{
    function store(Request $request){
        $cliente = $this->clienteUpdateOrCreate($request);

        $request->merge(['user_id' => auth()->user()->id,]);
        $request->merge(['cliente_id' => $cliente->id,]);
        $request->merge(['fecha' => date('Y-m-d H:i:s'),]);
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
        }
        $venta->update(['total' => $total]);
        $venta->ventaDetalles()->createMany($insertProductos);

        return Venta::with('user', 'ventaDetalles.producto')->findOrFail($venta->id);
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
    function index(){
        return Venta::with('user', 'cliente')->get();
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
