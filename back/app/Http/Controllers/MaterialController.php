<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller{
    function index(){
        return Material::orderBy('id', 'desc')
            ->get();
    }
    function update(Request $request, $id){
        $material = Material::find($id);
        $material->update($request->all());
        return $material;
    }
    function store(Request $request){
        $material = Material::create($request->all());
        return $material;
    }
    function destroy($id){
        $material = Material::find($id);
        $material->delete();
        return $material;
    }
}
