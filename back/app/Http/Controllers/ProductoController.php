<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller{
    function index(Request $request) {
        $search = $request->search;

        $productos = Producto::where(function ($query) use ($search) {
            $query->where('nombre', 'like', "%$search%")
                ->orWhere('descripcion', 'like', "%$search%");
        })
            ->orderBy('nombre')
            ->paginate(15);

        return response()->json($productos);
    }
}
