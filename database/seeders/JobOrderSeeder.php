<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Permission::create([
            'name' => 'view any job order',
            'guard_name' => 'web',
        ]);
        \App\Models\Permission::create([
            'name' => 'create job order',
            'guard_name' => 'web',
        ]);
        \App\Models\Permission::create([
            'name' => 'update job order',
            'guard_name' => 'web',
        ]);
        \App\Models\Permission::create([
            'name' => 'delete job order',
            'guard_name' => 'web',
        ]);
    }
}
