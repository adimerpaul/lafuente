<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;

class AreaController extends Controller{
    public function index(){
        return Area::all();
    }
    public function store(Request $request){
        return Area::create($request->all());
    }
    public function update(Request $request, Area $area){
        $area->update($request->all());
        return $area;
    }
    public function destroy(Area $area){
        $area->delete();
        return $area;
    }
}
