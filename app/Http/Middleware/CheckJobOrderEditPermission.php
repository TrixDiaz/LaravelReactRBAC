<?php

namespace App\Http\Middleware;

use App\Models\JobOrder;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckJobOrderEditPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized');
        }

        // Get the job order from the route parameter
        $jobOrderId = $request->route('jobOrder');
        $jobOrder = null;

        if ($jobOrderId) {
            // If it's already a model instance, use it
            if ($jobOrderId instanceof JobOrder) {
                $jobOrder = $jobOrderId;
            } else {
                // Otherwise, find it by ID
                $jobOrder = JobOrder::find($jobOrderId);
            }
        }

        // Check if user has admin or moderator role (full access)
        $userRoles = $user->roles->pluck('name')->toArray();
        $hasAdminOrModeratorRole = in_array('admin', $userRoles) || in_array('moderator', $userRoles);

        if ($hasAdminOrModeratorRole) {
            return $next($request);
        }

        // If user doesn't have admin/moderator role, check if they are assigned to this job order
        if ($jobOrder && $jobOrder instanceof JobOrder) {
            $isAssignedToJobOrder = $jobOrder->engineer_id === $user->id ||
                $jobOrder->engineer_supervisor_id === $user->id ||
                $jobOrder->company_manager_id === $user->id;

            if ($isAssignedToJobOrder) {
                return $next($request);
            }
        }

        abort(403, 'You do not have permission to edit this job order. Only admins, moderators, or assigned engineers, supervisors, and managers can edit job orders.');
    }
}
