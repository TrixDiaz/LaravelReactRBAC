<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\JobOrder;

class TestJobOrderPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:joborder-permissions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test job order edit and delete permissions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Job Order Permissions');
        $this->info('============================');
        $this->newLine();

        // Get all users
        $users = User::with('roles')->get();
        $jobOrders = JobOrder::all();

        if ($jobOrders->isEmpty()) {
            $this->warn('No job orders found. Please create some job orders first.');
            return;
        }

        $jobOrder = $jobOrders->first();

        foreach ($users as $user) {
            $userRoles = $user->roles->pluck('name')->toArray();
            
            // Check edit permissions
            $hasAdminOrModeratorRole = in_array('admin', $userRoles) || in_array('moderator', $userRoles);
            $isAssignedToJobOrder = $jobOrder->engineer_id === $user->id ||
                                   $jobOrder->engineer_supervisor_id === $user->id ||
                                   $jobOrder->company_manager_id === $user->id;

            $canEdit = $hasAdminOrModeratorRole || $isAssignedToJobOrder;
            $canDelete = $hasAdminOrModeratorRole;

            $this->line("User: {$user->name} ({$user->email})");
            $this->line("Roles: " . implode(', ', $userRoles));
            $this->line("Assigned to Job Order: " . ($isAssignedToJobOrder ? 'YES' : 'NO'));
            $this->line("Can Edit Job Order: " . ($canEdit ? 'YES' : 'NO'));
            $this->line("Can Delete Job Order: " . ($canDelete ? 'YES' : 'NO'));
            $this->line('---');
        }

        $this->newLine();
        $this->info('Test completed!');
    }
} 