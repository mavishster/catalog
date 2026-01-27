<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (!User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password', // будет захеширован через cast
            ]);
        }

        // Seed categories and products
        $this->call([
            \Database\Seeders\CategorySeeder::class,
            \Database\Seeders\ProductSeeder::class,
        ]);
    }
}
