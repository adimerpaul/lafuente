<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductoController extends Controller{
    function productosAll(){
        return Producto::orderBy('nombre')->get();
    }
    public function index(Request $request) {
        $search = $request->search;
        $perPage = $request->per_page ?? 10;

        $productos = Producto::where(function ($query) use ($search) {
            $query->where('nombre', 'like', "%$search%")
                ->orWhere('descripcion', 'like', "%$search%");
        })
            ->orderBy('nombre')
            ->paginate($perPage);

        return response()->json($productos);
    }
    function uploadFoto(Request $request, $id){
//        file
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $producto = Producto::find($id);
        if (!$producto) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }
        $file = $request->file('file');
        $fileName = time() . '.' . $file->getClientOriginalExtension();
        $filePath = public_path('/images');
        $file->move($filePath, $fileName);
        $manager = new ImageManager(new Driver());
        $image = $manager->read($filePath . '/' . $fileName);
        $image->scale(width: 300);
        $image->toPng()->save($filePath . '/' . $fileName);

        $producto->imagen = $fileName;
        $producto->save();
    }
    function store(Request $request){
        return Producto::create($request->all());
    }
    function update(Request $request, Producto $producto){
        $producto->update($request->all());
        return $producto;
    }
    function destroy(Producto $producto){
        $producto->delete();
        return response()->json(['success' => true]);
    }
}
