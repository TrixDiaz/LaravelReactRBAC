<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckJobOrderDeletePermission
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

        // Only admin and moderator can delete job orders
        $userRoles = $user->roles->pluck('name')->toArray();
        $hasAdminOrModeratorRole = in_array('admin', $userRoles) || in_array('moderator', $userRoles);

        if (!$hasAdminOrModeratorRole) {
            abort(403, 'You do not have permission to delete job orders. Only admins and moderators can delete job orders.');
        }

        return $next($request);
    }
} 