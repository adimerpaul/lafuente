<?php

use App\Http\Controllers\CompraController;
use App\Http\Controllers\VentaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');
Route::post('/login', [App\Http\Controllers\UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\UserController::class, 'logout']);
    Route::get('/me', [App\Http\Controllers\UserController::class, 'me']);


    Route::get('/users', [App\Http\Controllers\UserController::class, 'index']);
    Route::post('/users', [App\Http\Controllers\UserController::class, 'store']);
    Route::put('/users/{user}', [App\Http\Controllers\UserController::class, 'update']);
    Route::delete('/users/{user}', [App\Http\Controllers\UserController::class, 'destroy']);
    Route::put('/updatePassword/{user}', [App\Http\Controllers\UserController::class, 'updatePassword']);
    Route::get('/permisos', [App\Http\Controllers\UserController::class, 'permisos']);
    Route::put('users/{user}/permisos', [\App\Http\Controllers\UserController::class, 'updatePermisos']);


    Route::get('/pacientes', [App\Http\Controllers\PacienteController::class, 'index']);
    Route::post('/pacientes', [App\Http\Controllers\PacienteController::class, 'store']);
    Route::get('/pacientes/{paciente}', [App\Http\Controllers\PacienteController::class, 'show']);
    Route::put('/pacientes/{paciente}', [App\Http\Controllers\PacienteController::class, 'update']);
    Route::delete('/pacientes/{paciente}', [App\Http\Controllers\PacienteController::class, 'destroy']);

    Route::post('/historial_medicos', [App\Http\Controllers\HistorialMedicoController::class, 'store']);

    Route::post('/signos_vitales', [App\Http\Controllers\SignosVitaleController::class, 'store']);

    Route::post('/antecedentes_familiares', [App\Http\Controllers\AntecedentesFamiliareController::class, 'store']);

    Route::post('/habitos_personales', [App\Http\Controllers\HabitosPersonaleController::class, 'store']);

    Route::post('/diagnosticos', [App\Http\Controllers\DiagnosticoController::class, 'store']);

    Route::post('/recetas', [App\Http\Controllers\RecetaController::class, 'store']);
    Route::get('/receta/{receta}', [App\Http\Controllers\RecetaController::class, 'show']);

    Route::post('/productos', [App\Http\Controllers\ProductoController::class, 'store']);
    Route::post('/productos/{id}/foto', [App\Http\Controllers\ProductoController::class, 'uploadFoto']);
    Route::get('/productosAll', [App\Http\Controllers\ProductoController::class, 'productosAll']);
    Route::get('/productos', [App\Http\Controllers\ProductoController::class, 'index']);
    Route::put('/productos/{producto}', [App\Http\Controllers\ProductoController::class, 'update']);
    Route::delete('/productos/{producto}', [App\Http\Controllers\ProductoController::class, 'destroy']);

    Route::post('/searchCliente', [App\Http\Controllers\ClienteController::class, 'searchCliente']);

    Route::post('/ventas', [App\Http\Controllers\VentaController::class, 'store']);
    Route::get('/ventas', [App\Http\Controllers\VentaController::class, 'index']);
    Route::put('/ventasAnular/{venta}', [App\Http\Controllers\VentaController::class, 'anular']);
    Route::put('/tipoVentasChange/{venta}', [App\Http\Controllers\VentaController::class, 'tipoVentasChange']);

    Route::post('/paciente_ventas', [App\Http\Controllers\PacienteVentaController::class, 'store']);
    Route::put('/paciente_ventas/{paciente_venta}', [App\Http\Controllers\PacienteVentaController::class, 'update']);
    Route::delete('/paciente_ventas/{paciente_venta}', [App\Http\Controllers\PacienteVentaController::class, 'destroy']);

    Route::post('/cobros', [App\Http\Controllers\CobroController::class, 'store']);
    Route::put('/cobros/{cobro}', [App\Http\Controllers\CobroController::class, 'update']);

    Route::post('/facturas', [App\Http\Controllers\FacturaController::class, 'store']);
    Route::put('/facturas/{factura}', [App\Http\Controllers\FacturaController::class, 'update']);

    Route::post('/pagos', [App\Http\Controllers\PagoController::class, 'store']);
    Route::put('/pagos/{pago}', [App\Http\Controllers\PagoController::class, 'update']);

    Route::get('/proveedores', [App\Http\Controllers\ProveedorController::class, 'index']);
    Route::post('/proveedores', [App\Http\Controllers\ProveedorController::class, 'store']);
    Route::put('/proveedores/{proveedor}', [App\Http\Controllers\ProveedorController::class, 'update']);
    Route::delete('/proveedores/{proveedor}', [App\Http\Controllers\ProveedorController::class, 'destroy']);

    Route::get('compras', [App\Http\Controllers\CompraController::class, 'index']);
    Route::put('comprasAnular/{id}', [App\Http\Controllers\CompraController::class, 'anular']);
    Route::post('compras', [App\Http\Controllers\CompraController::class, 'store']);
    Route::get('/productosPorVencer', [App\Http\Controllers\CompraController::class, 'productosPorVencer']);
    Route::get('/productosVencidos', [App\Http\Controllers\CompraController::class, 'productosVencidos']);
    Route::get('/productos/{id}/historial-compras', [App\Http\Controllers\CompraController::class, 'historialCompras']);

    Route::get('/productos-por-vencer-campana', [\App\Http\Controllers\CompraDetalleController::class, 'vencimientosCampana']);
    Route::get('/productosCantidad', [\App\Http\Controllers\ProductoController::class, 'productosCantidad']);

    Route::get('/productos/{id}/historial-compras-ventas', [App\Http\Controllers\ProductoController::class, 'historialComprasVentas']);

    Route::get('/doctores', [App\Http\Controllers\DoctorController::class, 'index']);
    Route::post('/doctores', [App\Http\Controllers\DoctorController::class, 'store']);
    Route::put('/doctores/{doctor}', [App\Http\Controllers\DoctorController::class, 'update']);
    Route::delete('/doctores/{doctor}', [App\Http\Controllers\DoctorController::class, 'destroy']);
    Route::post('/ventasDevolverProducto', [App\Http\Controllers\VentaController::class, 'ventasDevolverProducto']);
});
Route::get('historial_medicos/{id}/pdf', [App\Http\Controllers\HistorialMedicoController::class, 'generatePdf']);
Route::get('receta/{id}/pdf', [App\Http\Controllers\RecetaController::class, 'generatePdf']);

Route::get('pacientes/{paciente}/proforma-pdf', [\App\Http\Controllers\VentaController::class, 'proformaPacientePdf']);


