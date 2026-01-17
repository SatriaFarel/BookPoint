<?php

use App\Models\Products;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\CustumerController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\OrderController;

// SELLER
Route::prefix('seller')->group(function () {
    Route::get('/', [SellerController::class, 'index']);
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
    Route::post('/', [OrderController::class, 'store']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']);
});

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout']);