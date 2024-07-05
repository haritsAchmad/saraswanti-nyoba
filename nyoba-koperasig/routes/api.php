<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AksesController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\KategoriBarangController;
use App\Http\Controllers\MerkBarangController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PenjualanDetailController;
use App\Http\Controllers\PenjualanMasterController;
use App\Http\Controllers\UsersController;

/**
 * route "/register"
 * @method "POST"
 */
Route::post('/register', App\Http\Controllers\Api\RegisterController::class)->name('register');

/**
 * route "/login"
 * @method "POST"
 */
Route::post('/login', App\Http\Controllers\Api\LoginController::class)->name('login');

/**
 * route "/user"
 * @method "GET"
 */
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

/**
 * route "/logout"
 * @method "POST"
 */
Route::post('/logout', App\Http\Controllers\Api\LogoutController::class)->name('logout');

/**
 * route "/akses"
 * resource controller routes
 */
Route::middleware('auth:api')->group(function() {
    Route::resource('akses', AksesController::class);
});

/**
 * route "/barang"
 * resource controller routes
 */
Route::middleware('auth:api')->group(function() {
    Route::resource('barang', BarangController::class);
});

/**
 * route "/session"
 * resource controller routes
 */
Route::middleware('auth:api')->group(function() {
    Route::resource('session', SessionController::class);
});

/**
 * route "/kategoribarang"
 * resource controller routes
 */
Route::middleware('auth:api')->group(function() {
    Route::resource('kategoribarang', KategoriBarangController::class);
});

/**
 * route "/merkbarang"
 * resource controller routes
 */
Route::middleware('auth:api')->group(function() {
    Route::resource('merkbarang', MerkBarangController::class);
});

/**
 * route "/pelanggan"
 * resource controller routes
 */
Route::middleware('auth:api')->group(function() {
    Route::resource('pelanggan', PelangganController::class);
});

/**
 * route "/penjualandetail"
 * resource controller routes
 */
Route::middleware('auth:api')->group(function() {
    Route::resource('penjualandetail', PenjualanDetailController::class);
});

/**
 * route "/penjualanmaster"
 * resource controller routes
 */
Route::middleware('auth:api')->group(function() {
    Route::resource('penjualanmaster', PenjualanMasterController::class);
});

/**
 * route "/users"
 * resource controller routes
 */
Route::middleware('auth:api')->group(function() {
    Route::resource('users', UsersController::class);
});