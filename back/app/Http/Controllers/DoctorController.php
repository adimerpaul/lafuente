<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller{
    function index(){
        return Doctor::all();
    }
    function store(Request $request){
        $doctor = Doctor::create($request->all());
        return response()->json($doctor, 201);
    }
    function update(Request $request, $id){
        $doctor = Doctor::findOrFail($id);
        $doctor->update($request->all());
        return response()->json($doctor, 200);
    }
    function destroy($id)
    {
        Doctor::destroy($id);
        return response()->json(null, 204);
    }
}
