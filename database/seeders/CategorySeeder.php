<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $names = [
            'Электроника',
            'Одежда',
            'Дом и сад',
            'Спорт и отдых',
            'Красота и здоровье',
            'Автотовары',
            'Игры и развлечения',
            'Книги',
        ];

        foreach ($names as $name) {
            Category::firstOrCreate(
                ['name' => $name],
                ['description' => null]
            );
        }
    }
}
