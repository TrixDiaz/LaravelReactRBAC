<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users with different roles
        $testUsers = [
            [
                'name' => 'Engineer User',
                'email' => 'engineer@example.com',
                'password' => 'password',
                'role' => 'engineer'
            ],
            [
                'name' => 'Manager User',
                'email' => 'manager@example.com',
                'password' => 'password',
                'role' => 'manager'
            ],
            [
                'name' => 'Supervisor User',
                'email' => 'supervisor@example.com',
                'password' => 'password',
                'role' => 'supervisor'
            ],
            [
                'name' => 'Moderator User',
                'email' => 'moderator@example.com',
                'password' => 'password',
                'role' => 'moderator'
            ],
            [
                'name' => 'Regular User',
                'email' => 'user@example.com',
                'password' => 'password',
                'role' => null // No special role
            ]
        ];

        foreach ($testUsers as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($userData['password']),
                ]
            );

            if ($userData['role']) {
                $role = Role::where('name', $userData['role'])->first();
                if ($role) {
                    $user->syncRoles([$role->name]);
                }
            }
        }
    }
}
