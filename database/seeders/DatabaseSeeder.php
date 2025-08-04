<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            \Database\Seeders\AdminSeeder::class,
            \Database\Seeders\RoleSeeder::class,
            \Database\Seeders\JobOrderSeeder::class,
        ]);

        User::factory(10)->create();
    }
}
