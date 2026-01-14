<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\SellerController;


Route::get('/', function () {
    return view('welcome');
});

// Route::get('/messages', [MessageController::class, 'index']);
// Route::post('/messages', [MessageController::class, 'store']);
// Route::put('/messages/{id}', [MessageController::class, 'update']);
// Route::delete('/messages/{id}', [MessageController::class, 'destroy']);

// Route::get('/chat', [MessageController::class, 'page']);
// Route::post('/chat', [MessageController::class, 'store']);
// Route::post('/chat/delete/{id}', [MessageController::class, 'destroy']);

Route::prefix('api/seller')->group(function () {
    Route::get('/', [SellerController::class, 'index']);
    Route::post('/', [SellerController::class, 'store']);
    Route::put('/{id}', [SellerController::class, 'update']);
    Route::delete('/{id}', [SellerController::class, 'destroy']);
});