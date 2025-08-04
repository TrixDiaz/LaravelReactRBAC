<?php

namespace Database\Seeders;

use App\Models\User;
use App\Notifications\AppNotification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // Create some sample notifications
            $user->notify(new AppNotification(
                'Welcome to the system!',
                'Thank you for joining our platform. We hope you enjoy using our services.',
                'welcome'
            ));

            $user->notify(new AppNotification(
                'System Update',
                'We have updated our system with new features. Check them out!',
                'system'
            ));

            $user->notify(new AppNotification(
                'New Job Order Created',
                'A new job order has been created and assigned to you.',
                'job_order'
            ));
        }
    }
}
