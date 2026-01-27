<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure categories exist
        if (Category::count() === 0) {
            $this->call(CategorySeeder::class);
        }

        // Create products bound to existing categories
        $categories = Category::all();

        // If for some reason categories are still empty, create via factory
        if ($categories->isEmpty()) {
            $categories = Category::factory()->count(6)->create();
        }

        // Create 150 products distributed across categories
        Product::factory()
            ->count(150)
            ->state(function () use ($categories) {
                return [
                    'category_id' => $categories->random()->id,
                ];
            })
            ->create();
    }
}
