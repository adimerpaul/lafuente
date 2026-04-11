<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductoController extends Controller{
    private const FECHA_INICIO_EXISTENCIAS = '2025-10-01';

    private function baseProductosQuery(?string $search = null)
    {
        $search = trim((string) $search);

        return Producto::query()
            ->select([
                'productos.id',
                'productos.nombre',
                'productos.descripcion',
                'productos.unidad',
                'productos.precio',
                'productos.stock',
                'productos.stock_minimo',
                'productos.stock_maximo',
                'productos.imagen',
            ])
            ->withSum(
                ['comprasDetalles as cantidad' => function ($q) {
                    $q->where('estado', 'Activo')
                        ->where('cantidad_venta', '>', 0);
                }],
                'cantidad_venta'
            )
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('productos.nombre', 'like', "%{$search}%")
                        ->orWhere('productos.descripcion', 'like', "%{$search}%");
                });
            });
    }

    private function resolveFechaExistencia(Request $request): string
    {
        $fecha = $request->input('fecha');

        if (!$fecha) {
            abort(422, 'Debe seleccionar una fecha para consultar la existencia.');
        }

        try {
            $fechaNormalizada = Carbon::parse($fecha)->format('Y-m-d');
        } catch (\Throwable $e) {
            abort(422, 'La fecha enviada no es válida.');
        }

        if ($fechaNormalizada < self::FECHA_INICIO_EXISTENCIAS) {
            abort(422, 'Solo se puede consultar existencia desde 2025-10-01.');
        }

        return $fechaNormalizada;
    }

    private function baseProductosExistenciaFechaQuery(string $fecha, ?string $search = null)
    {
        $search = trim((string) $search);

        $ingresosSubquery = DB::table('compra_detalles as cd')
            ->join('compras as c', 'c.id', '=', 'cd.compra_id')
            ->selectRaw('cd.producto_id, SUM(COALESCE(cd.cantidad, 0)) as ingresos')
            ->where('c.estado', 'Activo')
            ->where('cd.estado', 'Activo')
            ->whereNull('c.deleted_at')
            ->whereNull('cd.deleted_at')
            ->whereDate('c.fecha', '<=', $fecha)
            ->groupBy('cd.producto_id');

        $salidasSubquery = DB::table('venta_detalles as vd')
            ->join('ventas as v', 'v.id', '=', 'vd.venta_id')
            ->selectRaw('vd.producto_id, SUM(COALESCE(vd.cantidad, 0)) as salidas')
            ->where('v.estado', 'Activo')
            ->whereNull('v.deleted_at')
            ->whereNull('vd.deleted_at')
            ->whereDate('v.fecha', '<=', $fecha)
            ->groupBy('vd.producto_id');

        return Producto::query()
            ->leftJoinSub($ingresosSubquery, 'ingresos_hasta_fecha', function ($join) {
                $join->on('productos.id', '=', 'ingresos_hasta_fecha.producto_id');
            })
            ->leftJoinSub($salidasSubquery, 'salidas_hasta_fecha', function ($join) {
                $join->on('productos.id', '=', 'salidas_hasta_fecha.producto_id');
            })
            ->select([
                'productos.id',
                'productos.nombre',
                'productos.descripcion',
                'productos.unidad',
                'productos.precio',
                'productos.stock',
                'productos.stock_minimo',
                'productos.stock_maximo',
                'productos.imagen',
            ])
            ->selectRaw('COALESCE(ingresos_hasta_fecha.ingresos, 0) - COALESCE(salidas_hasta_fecha.salidas, 0) as cantidad')
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('productos.nombre', 'like', "%{$search}%")
                        ->orWhere('productos.descripcion', 'like', "%{$search}%");
                });
            });
    }

    public function precios(Request $request)
    {
        $search  = trim($request->input('search', ''));
        $perPage = (int) $request->input('per_page', 24);

        $productos = $this->baseProductosQuery($search)
            ->select(['id','nombre','precio','imagen'])
            ->orderBy('nombre')
            ->paginate($perPage);

        return response()->json($productos);
    }
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
                        ->orWhere('productos.descripcion', 'like', "%{$search}%");
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
        return $this->baseProductosQuery()
            ->orderBy('nombre')
            ->get();
    }
    public function exportIndex(Request $request)
    {
        $search = $request->input('search');
        $perPage = min((int) $request->input('per_page', 5000), 10000);
        $soloExistentes = filter_var($request->input('existentes', false), FILTER_VALIDATE_BOOL);

        $query = $this->baseProductosQuery($search);

        if ($soloExistentes) {
            $query->having('cantidad', '>', 0)
                ->orderByDesc('cantidad')
                ->orderBy('productos.nombre');
        } else {
            $query->orderBy('productos.nombre');
        }

        return response()->json($query->paginate($perPage));
    }
    public function exportExistenciaFecha(Request $request)
    {
        $fecha = $this->resolveFechaExistencia($request);
        $search = $request->input('search');
        $perPage = min((int) $request->input('per_page', 5000), 10000);
        $soloExistentes = filter_var($request->input('existentes', false), FILTER_VALIDATE_BOOL);

        $query = $this->baseProductosExistenciaFechaQuery($fecha, $search);

        if ($soloExistentes) {
            $query->having('cantidad', '>', 0)
                ->orderByDesc('cantidad')
                ->orderBy('productos.nombre');
        } else {
            $query->orderBy('productos.nombre');
        }

        $result = $query->paginate($perPage);
        $result->appends([
            'fecha' => $fecha,
            'existentes' => $soloExistentes,
            'search' => $search,
        ]);

        return response()->json($result);
    }
    public function index(Request $request) {
        $search = $request->search;
        $perPage = $request->per_page ?? 10;

        $productos = $this->baseProductosQuery($search)
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
