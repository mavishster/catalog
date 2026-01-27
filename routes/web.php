<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [\App\Http\Controllers\ProductController::class, 'index'])
    ->name('products.index');
Route::get('/product/{id}', [\App\Http\Controllers\ProductController::class, 'show'])
    ->name('products.show');

Route::view('/login', 'welcome')->name('login');
Route::view('/admin/{any}', 'welcome')->where('any', '.*')->name('admin.spa');
