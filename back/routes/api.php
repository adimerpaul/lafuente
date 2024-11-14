<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');
Route::post('/login', [App\Http\Controllers\UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\UserController::class, 'logout']);
    Route::get('/me', [App\Http\Controllers\UserController::class, 'me']);

    Route::get('/periodos', [App\Http\Controllers\PeriodoController::class, 'index']);
    Route::post('/periodos', [App\Http\Controllers\PeriodoController::class, 'store']);
    Route::put('/periodos/{periodo}', [App\Http\Controllers\PeriodoController::class, 'update']);
    Route::delete('/periodos/{periodo}', [App\Http\Controllers\PeriodoController::class, 'destroy']);

    Route::get('/users', [App\Http\Controllers\UserController::class, 'index']);
    Route::post('/users', [App\Http\Controllers\UserController::class, 'store']);
    Route::put('/users/{user}', [App\Http\Controllers\UserController::class, 'update']);
    Route::delete('/users/{user}', [App\Http\Controllers\UserController::class, 'destroy']);
    Route::put('/updatePassword/{user}', [App\Http\Controllers\UserController::class, 'updatePassword']);

    Route::get('/areas', [App\Http\Controllers\AreaController::class, 'index']);
    Route::post('/areas', [App\Http\Controllers\AreaController::class, 'store']);
    Route::put('/areas/{area}', [App\Http\Controllers\AreaController::class, 'update']);
    Route::delete('/areas/{area}', [App\Http\Controllers\AreaController::class, 'destroy']);

    Route::get('/materials', [App\Http\Controllers\MaterialController::class, 'index']);
    Route::post('/materials', [App\Http\Controllers\MaterialController::class, 'store']);
    Route::put('/materials/{material}', [App\Http\Controllers\MaterialController::class, 'update']);
    Route::delete('/materials/{material}', [App\Http\Controllers\MaterialController::class, 'destroy']);

    Route::get('/poas', [App\Http\Controllers\PoaController::class, 'index']);
    Route::post('/poas', [App\Http\Controllers\PoaController::class, 'store']);
    Route::get('/poas/{poa}', [App\Http\Controllers\PoaController::class, 'show']);
    Route::put('/poas/{poa}', [App\Http\Controllers\PoaController::class, 'update']);
    Route::delete('/poas/{poa}', [App\Http\Controllers\PoaController::class, 'destroy']);
    Route::get('/periodos/activos', [App\Http\Controllers\PeriodoController::class, 'periodosActivos']);
    Route::post('/materialAdd', [App\Http\Controllers\PoaController::class, 'materialAdd']);
    Route::put('/materialUpdate/{detallePoa}', [App\Http\Controllers\PoaController::class, 'materialUpdate']);
    Route::delete('/materialDelete/{detallePoa}', [App\Http\Controllers\PoaController::class, 'materialDelete']);
});
Route::get('/poaPrint/{poa}', [App\Http\Controllers\PoaController::class, 'poaPrint']);
