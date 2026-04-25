<?php

use App\Http\Controllers\CompraController;
use App\Http\Controllers\VentaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');
Route::post('/login', [App\Http\Controllers\UserController::class, 'login']);
Route::get('/caja-recepciones/pdf', [App\Http\Controllers\CajaRecepcionController::class, 'pdf']);
Route::get('/caja-recepciones/{cajaRecepcion}/pdf-carta', [App\Http\Controllers\CajaRecepcionController::class, 'pdfCarta']);
Route::get('/caja-recepciones/{cajaRecepcion}/pdf-formulario-control', [App\Http\Controllers\CajaRecepcionController::class, 'pdfFormularioControl']);
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
    Route::put('/pacientes/{paciente}/alta', [App\Http\Controllers\PacienteController::class, 'darAlta']);
    Route::delete('/pacientes/{paciente}', [App\Http\Controllers\PacienteController::class, 'destroy']);
    Route::get('/pacientes-reporte/pdf', [App\Http\Controllers\PacienteController::class, 'reportePdf']);
    Route::get('/pacientes/exportar/interno-alta', [App\Http\Controllers\PacienteController::class, 'exportarInternoAlta']);
    Route::get('/pacientes-reporte/altas-bajas', [App\Http\Controllers\PacienteController::class, 'reporteAltasBajas']);
    Route::get('/pacientes-reporte/altas-bajas-pdf', [App\Http\Controllers\PacienteController::class, 'reporteAltasBajasPdf']);
    Route::get('/paciente-fotos', [App\Http\Controllers\PacienteFotoController::class, 'index']);
    Route::post('/paciente-fotos', [App\Http\Controllers\PacienteFotoController::class, 'store']);
    Route::delete('/paciente-fotos/{pacienteFoto}', [App\Http\Controllers\PacienteFotoController::class, 'destroy']);

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
    Route::get('/productos-export', [App\Http\Controllers\ProductoController::class, 'exportIndex']);
    Route::get('/productos-existencia-fecha-export', [App\Http\Controllers\ProductoController::class, 'exportExistenciaFecha']);
    Route::put('/productos/{producto}', [App\Http\Controllers\ProductoController::class, 'update']);
    Route::delete('/productos/{producto}', [App\Http\Controllers\ProductoController::class, 'destroy']);

    Route::post('/searchCliente', [App\Http\Controllers\ClienteController::class, 'searchCliente']);

    Route::post('/ventas', [App\Http\Controllers\VentaController::class, 'store']);
    Route::get('/ventas', [App\Http\Controllers\VentaController::class, 'index']);
    Route::put('/ventasAnular/{venta}', [App\Http\Controllers\VentaController::class, 'anular']);
    Route::put('/tipoVentasChange/{venta}', [App\Http\Controllers\VentaController::class, 'tipoVentasChange']);
    Route::put('/ventasFacturacion/{venta}', [App\Http\Controllers\VentaController::class, 'actualizarFacturacion']);
    Route::post('/ventas/{venta}/agregar-producto', [App\Http\Controllers\VentaController::class, 'agregarProducto']);
    Route::post('/ventas/{venta}/aumentar-producto', [App\Http\Controllers\VentaController::class, 'aumentarProducto']);

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

    // Rutas de Traspaso
    Route::get('/traspasos', [App\Http\Controllers\TraspasoController::class, 'index']);
    Route::get('/traspasos/productos', [App\Http\Controllers\TraspasoController::class, 'getProductos']);
    Route::get('/traspasos/lotes', [App\Http\Controllers\TraspasoController::class, 'getLotes']);
    Route::post('/traspasos', [App\Http\Controllers\TraspasoController::class, 'store']);
    Route::post('/traspasos/{venta}/anular', [App\Http\Controllers\TraspasoController::class, 'anular']);

    Route::get('/productos-por-vencer-campana', [\App\Http\Controllers\CompraDetalleController::class, 'vencimientosCampana']);
    Route::get('/productosCantidad', [\App\Http\Controllers\ProductoController::class, 'productosCantidad']);

    Route::get('/productos/{id}/historial-compras-ventas', [App\Http\Controllers\ProductoController::class, 'historialComprasVentas']);

    Route::get('/doctores', [App\Http\Controllers\DoctorController::class, 'index']);
    Route::post('/doctores', [App\Http\Controllers\DoctorController::class, 'store']);
    Route::put('/doctores/{doctor}', [App\Http\Controllers\DoctorController::class, 'update']);
    Route::delete('/doctores/{doctor}', [App\Http\Controllers\DoctorController::class, 'destroy']);
    Route::get('/aranceles', [App\Http\Controllers\ArancelController::class, 'index']);
    Route::post('/aranceles', [App\Http\Controllers\ArancelController::class, 'store']);
    Route::put('/aranceles/{arancel}', [App\Http\Controllers\ArancelController::class, 'update']);
    Route::delete('/aranceles/{arancel}', [App\Http\Controllers\ArancelController::class, 'destroy']);
    Route::get('/formularios-control', [App\Http\Controllers\FormularioControlController::class, 'index']);
    Route::get('/formularios-control/{formularioControl}', [App\Http\Controllers\FormularioControlController::class, 'show']);
    Route::post('/formularios-control', [App\Http\Controllers\FormularioControlController::class, 'store']);
    Route::put('/formularios-control/{formularioControl}', [App\Http\Controllers\FormularioControlController::class, 'update']);
    Route::delete('/formularios-control/{formularioControl}', [App\Http\Controllers\FormularioControlController::class, 'destroy']);
    Route::get('/caja-recepciones', [App\Http\Controllers\CajaRecepcionController::class, 'index']);
    Route::get('/caja-recepciones/{cajaRecepcion}', [App\Http\Controllers\CajaRecepcionController::class, 'show']);
    Route::post('/caja-recepciones', [App\Http\Controllers\CajaRecepcionController::class, 'store']);
    Route::put('/caja-recepciones/{cajaRecepcion}', [App\Http\Controllers\CajaRecepcionController::class, 'update']);
    Route::post('/caja-recepciones/{cajaRecepcion}/cobrar', [App\Http\Controllers\CajaRecepcionController::class, 'cobrar']);
    Route::put('/caja-recepciones/{cajaRecepcion}/anular', [App\Http\Controllers\CajaRecepcionController::class, 'anular']);
    Route::delete('/caja-recepciones/{cajaRecepcion}', [App\Http\Controllers\CajaRecepcionController::class, 'destroy']);
    Route::post('/ventasDevolverProducto', [App\Http\Controllers\VentaController::class, 'ventasDevolverProducto']);

    Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index']);

    Route::get('/productos-precios', [App\Http\Controllers\ProductoController::class, 'precios']);
//    this.$axios.put(`ventasCambiarTipoPago/${venta.id}`, { tipo_pago: tipoPago }).then(res => {
    Route::put('/ventasCambiarTipoPago/{venta}', [App\Http\Controllers\VentaController::class, 'cambiarTipoPago']);
    Route::put('comprasCambiarLoteFecha/{compra}', [App\Http\Controllers\CompraController::class, 'cambiarLoteFecha']);


});
Route::get('historial_medicos/{id}/pdf', [App\Http\Controllers\HistorialMedicoController::class, 'generatePdf']);
Route::get('receta/{id}/pdf', [App\Http\Controllers\RecetaController::class, 'generatePdf']);

Route::get('pacientes/{paciente}/proforma-pdf', [\App\Http\Controllers\VentaController::class, 'proformaPacientePdf']);
Route::get('pacientes/{paciente}/caja-liquidacion-pdf', [\App\Http\Controllers\CajaRecepcionController::class, 'liquidacionPacientePdf']);
Route::get('ventas/pdf', [\App\Http\Controllers\VentaController::class, 'ventasPdf']);
Route::get('reportes/farmacia/pdf', [\App\Http\Controllers\VentaController::class, 'reporteFarmaciaPdf']);
Route::get('formularios-control/{formularioControl}/pdf', [\App\Http\Controllers\FormularioControlController::class, 'generatePdf']);

Route::get('/inventario-inicial-medicamentos/pdf', [\App\Http\Controllers\ReporteInventarioController::class, 'inventarioInicialMedicamentosPdf']);
