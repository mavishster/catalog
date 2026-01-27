<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Home');
    }

    public function show(string $id)
    {
        return Inertia::render('Product/Show', [
            'id' => (int) $id,
        ]);
    }
}
