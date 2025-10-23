<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin role if not exists
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // List of permissions
        $permissions = [
            // Dashboard access
            'view dashboard',

            // Permission management
            'view any permissions',
            'create permissions',
            'update permissions',
            'delete permissions',

            // Role management
            'view any roles',
            'create roles',
            'update roles',
            'delete roles',

            // User management
            'view any users',
            'create users',
            'update users',
            'delete users',
        ];

        // Create and assign permissions to the admin role
        foreach ($permissions as $permissionName) {
            $permission = Permission::firstOrCreate([
                'name' => $permissionName,
                'guard_name' => 'web'
            ]);
            $adminRole->givePermissionTo($permission); // assign to role
        }

        // Create the admin user
        $admin = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test Admin User',
                'password' => Hash::make('password'),
            ]
        );

        // Assign admin role to the user (inherits all permissions)
        $admin->assignRole($adminRole);
    }
}
