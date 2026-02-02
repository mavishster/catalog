<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('ProductListPage');
    }

    public function show(string $id)
    {
        return Inertia::render('Product/ProductShow', [
            'id' => (int) $id,
        ]);
    }
}
