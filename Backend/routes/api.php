<?php

use App\Models\Products;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\CustumerController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ProfileController;

// SELLER
Route::prefix('seller')->group(function () {
    Route::get('/', [SellerController::class, 'index']);
    Route::get('/{id}', [SellerController::class, 'show']);

    Route::get('/dashboard/{sellerId}', [SellerController::class, 'dashboard']);
    Route::get('/orders/{seller_id}', [OrderController::class, 'sellerOrders']);
    Route::patch('/orders/{id}/approve', [OrderController::class, 'approve']);
    Route::patch('/orders/{id}/reject', [OrderController::class, 'reject']);
    Route::get('/reports/{seller_id}', [SellerController::class, 'sales']);
    Route::post('/orders/{order}/resi', [SellerController::class, 'storeResi']);

    Route::post('/', [SellerController::class, 'store']);
    Route::put('/{id}', [SellerController::class, 'update']);
    Route::delete('/{id}', [SellerController::class, 'destroy']);
});

// CUSTOMER
Route::prefix('customer')->group(function () {
    Route::get('/', [CustumerController::class, 'index']);
    Route::post('/', [CustumerController::class, 'store']);
    Route::put('/{id}', [CustumerController::class, 'update']);
    Route::delete('/{id}', [CustumerController::class, 'destroy']);
});

// CATEGORIES
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoriesController::class, 'index']);
    Route::post('/', [CategoriesController::class, 'store']);
    Route::put('/{id}', [CategoriesController::class, 'update']);
    Route::delete('/{id}', [CategoriesController::class, 'destroy']);
});

// PRODUCTS
Route::prefix('products')->group(function () {
    Route::get('/', [ProductsController::class, 'index']);
    Route::post('/', [ProductsController::class, 'store']);
    Route::put('/{id}', [ProductsController::class, 'update']);
    Route::delete('/{id}', [ProductsController::class, 'destroy']);
});

// ORDERS
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/{id}/invoice', [OrderController::class, 'invoice']);
    Route::post('/', [OrderController::class, 'store']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
});

Route::get('/chats/{userId}', [ChatController::class, 'chats']);
Route::get('/messages/{chatId}', [ChatController::class, 'messages']);
Route::post('/messages', [ChatController::class, 'store']);
Route::post('/chats', [ChatController::class, 'getOrCreateChat']);
Route::post('/update-orders', [OrderController::class, 'autoUpdate']);

Route::get('/user/profile/{id}', [ProfileController::class, 'show']);
Route::post('/user/profile/update', [ProfileController::class, 'update']);



Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout']);
