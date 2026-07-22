<?php

namespace App\Http\Controllers;

use App\Models\DetallePoa;
use App\Models\Material;
use App\Models\Poa;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class PoaController extends Controller{
    function poaPrint(Poa $poa){
        $poa = Poa::with('area', 'periodo', 'user', 'detalles.material')->find($poa->id);
//        $pdf = App::make('dompdf.wrapper');
//        $pdf->loadHTML('<h1>Test</h1>');
//        return $pdf->stream();
        $pdf = Pdf::loadView('pdf.poa');
        return $pdf->stream('poa.pdf');
    }
    function materialDelete(DetallePoa $detallePoa){
        $detallePoa->delete();
        return $detallePoa;
    }
    function materialUpdate(Request $request, DetallePoa $detallePoa){
        $detallePoa->update($request->all());
        return $detallePoa;
    }
    function materialAdd(Request $request){
        $poa = Poa::find($request->poa_id);
        $material = Material::find($request->material_id);

        $detallePoa = new DetallePoa();
//        protected $fillable = ['poa_id', 'material_id', 'cantidad', 'precio_unitario', 'total', 'cantidad_entregada'];
        $detallePoa->poa_id = $poa->id;
        $detallePoa->material_id = $material->id;
        $detallePoa->cantidad = $request->cantidad;
        $detallePoa->precio_unitario = $material->precio;
        $detallePoa->total = $request->cantidad * $material->precio;
        $detallePoa->cantidad_entregada = 0;
        $detallePoa->save();
        return $detallePoa::with('material')->find($detallePoa->id);
    }
    function index(Request $request){
        $user = $request->user();
        if ($user->id == 1) {
            return Poa::orderBy('id', 'desc')->with('area', 'periodo', 'user')->get();
        }else{
            return Poa::where('area_id', $user->area_id)->with('area', 'periodo', 'user')->orderBy('id', 'desc')->get();
        }
    }
    function store(Request $request){
        $user = $request->user();
        $poa = new Poa();
        $poa->area_id = $user->area_id;
        $poa->periodo_id = $request->periodo_id;
        $poa->user_id = $user->id;
        $poa->fecha = date('Y-m-d H:i:s');
        $poa->save();
    }
    function show(Poa $poa){
        $poa = Poa::with('area', 'periodo', 'user', 'detalles.material')->find($poa->id);
        return $poa;
    }
    function update(Request $request, Poa $poa){
        $poa->update($request->all());
        return $poa;
    }
    function destroy(Poa $poa){
        $poa->delete();
        return $poa;
    }
}
