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

        return Venta::create($request->all());
    }
    function clienteUpdateOrCreate($request){
        $nit = $request->nit;
        $findCliente = Cliente::where('nit', $nit)->first();
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
