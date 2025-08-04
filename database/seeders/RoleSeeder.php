<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create job order related permissions
        $jobOrderPermissions = [
            'view any job order',
            'create job order',
            'update job order',
            'delete job order',
        ];

        foreach ($jobOrderPermissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName]);
        }

        // Create roles and assign permissions
        $roles = [
            'engineer' => [
                'view any job order',
                'create job order',
                'update job order',
            ],
            'manager' => [
                'view any job order',
                'create job order',
                'update job order',
                'delete job order',
            ],
            'supervisor' => [
                'view any job order',
                'create job order',
                'update job order',
                'delete job order',
            ],
            'moderator' => [
                'view any job order',
                'create job order',
                'update job order',
                'delete job order',
            ],
        ];

        foreach ($roles as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($permissions);
        }

        // Update admin role to include job order permissions
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo($jobOrderPermissions);
        }
    }
} 