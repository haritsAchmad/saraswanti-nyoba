<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NyobaController;

Route::get('/', [NyobaController::class, 'index']);

