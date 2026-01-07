<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('devices', DeviceController::class);
    Route::patch('devices/{id}/use', [DeviceController::class, 'toggleUse']);
    Route::get('/user', [AuthController::class, 'user']);
});
