<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Фильтр по категории
        $category = $request->get('category') ?? $request->get('category_id');
        if (!empty($category)) {
            $query->where('category_id', $category);
        }

        // Поиск по названию и описанию
        $q = trim((string)$request->get('q', ''));
        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        // Пагинация: поддержка per_page с ограничением по максимуму
        $perPage = (int)$request->get('per_page', 12);
        if ($perPage < 1) {
            $perPage = 12;
        }
        if ($perPage > 100) {
            $perPage = 100;
        }

        return ProductResource::collection($query->paginate($perPage));
    }

    public function show(int $id)
    {
        $product = Product::with('category')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Товар не найден'], 404);
        }

        return new ProductResource($product);
    }


    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();
        $product = Product::create($validated);
        $product->load('category');

        return (new ProductResource($product))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateProductRequest $request, string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Товар не найден'], 404);
        }

        $validated = $request->validated();

        $product->fill($validated);
        $product->save();
        $product->load('category');

        return new ProductResource($product);
    }

    public function destroy(string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Товар не найден'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Товар удален'], 200);
    }
}
