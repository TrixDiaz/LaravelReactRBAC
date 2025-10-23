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
        \App\Models\Permission::firstOrCreate([
            'name' => 'view any job order',
            'guard_name' => 'web',
        ]);
        \App\Models\Permission::firstOrCreate([
            'name' => 'create job order',
            'guard_name' => 'web',
        ]);
        \App\Models\Permission::firstOrCreate([
            'name' => 'update job order',
            'guard_name' => 'web',
        ]);
        \App\Models\Permission::firstOrCreate([
            'name' => 'delete job order',
            'guard_name' => 'web',
        ]);
    }
}
