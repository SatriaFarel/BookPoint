<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\CustumerController;
use App\Http\Controllers\CategoriesController;


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

