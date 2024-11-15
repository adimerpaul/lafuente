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


    Route::get('/users', [App\Http\Controllers\UserController::class, 'index']);
    Route::post('/users', [App\Http\Controllers\UserController::class, 'store']);
    Route::put('/users/{user}', [App\Http\Controllers\UserController::class, 'update']);
    Route::delete('/users/{user}', [App\Http\Controllers\UserController::class, 'destroy']);
    Route::put('/updatePassword/{user}', [App\Http\Controllers\UserController::class, 'updatePassword']);

    Route::get('/pacientes', [App\Http\Controllers\PacienteController::class, 'index']);
    Route::post('/pacientes', [App\Http\Controllers\PacienteController::class, 'store']);
    Route::get('/pacientes/{paciente}', [App\Http\Controllers\PacienteController::class, 'show']);
    Route::put('/pacientes/{paciente}', [App\Http\Controllers\PacienteController::class, 'update']);
    Route::delete('/pacientes/{paciente}', [App\Http\Controllers\PacienteController::class, 'destroy']);

});
Route::get('/poaPrint/{poa}', [App\Http\Controllers\PoaController::class, 'poaPrint']);
