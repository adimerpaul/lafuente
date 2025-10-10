<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductoController extends Controller{
    public function historialComprasVentas($productoId)
    {
        $detalles = \App\Models\CompraDetalle::with('compra')
            ->where('producto_id', $productoId)
            ->where('estado', 'Activo')
            ->whereNull('deleted_at')
            ->where('cantidad_venta', '>', 0)
            ->orderByRaw("CASE WHEN fecha_vencimiento IS NULL THEN 1 ELSE 0 END, fecha_vencimiento ASC") // primero los que vencen antes
            ->get(['id','compra_id','producto_id','lote','fecha_vencimiento','cantidad','cantidad_venta','precio','factor','precio_venta','nro_factura']);

        // Puedes calcular 'disponible' = cantidad_venta si tu flujo lo maneja así
        $response = $detalles->map(function($d){
            return [
                'id'               => $d->id,                 // compra_detalle_id (lote)
                'compra_id'        => $d->compra_id,
                'agencia'          => $d->compra?->agencia,
                'producto_id'      => $d->producto_id,
                'lote'             => $d->lote,
                'fecha_vencimiento'=> $d->fecha_vencimiento,
                'cantidad'         => (float)$d->cantidad,         // cantidad comprada
                'disponible'       => (float)$d->cantidad_venta,   // REMANENTE para vender
                'precio'           => (float)$d->precio,           // costo
                'factor'           => (float)$d->factor,
                'precio_venta'     => (float)$d->precio_venta,     // sugerido para venta
                'nro_factura'      => $d->nro_factura,
            ];
        });

        return response()->json($response);
    }

    function productosCantidad(Request $request)
    {
        $search  = trim($request->input('search', ''));
        $perPage = (int) $request->input('per_page', 10);

        $productos = Producto::query()
            // Calcula el cantidad en SQL (suma de cantidad_venta con estado Activo)
            ->withSum(
                ['comprasDetalles as cantidad' => function ($q) {
                    $q->where('estado', 'Activo');
                }],
                'cantidad_venta'
            )
            // Búsqueda
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('productos.nombre', 'like', "%{$search}%")
                        ->orWhere('productos.descripcion', 'like', "%{$search}%")
//                        ->orWhere('productos.barra', 'like', "%{$search}%");
                });
            })
            // Filtra solo los que tienen cantidad > 0 (en SQL, no en PHP)
            ->having('cantidad', '>', 0)
            ->orderBy('productos.nombre')
            ->paginate($perPage);

        // El paginator ya trae data, current_page, last_page, total, etc.
        return response()->json($productos);
    }
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
