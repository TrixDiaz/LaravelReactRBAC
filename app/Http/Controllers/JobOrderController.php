<?php

namespace App\Http\Controllers;

use App\Models\JobOrder;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class JobOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = JobOrder::with(['engineer', 'engineerSupervisor', 'companyManager']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('job_order_number', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('company_contact_person', 'like', "%{$search}%")
                    ->orWhere('company_department', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('priority', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        // Filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->get('priority'));
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->get('type'));
        }

        $jobOrders = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('joborders/index', [
            'jobOrders' => $jobOrders,
            'filters' => $request->only(['search', 'status', 'priority', 'type'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all();

        return Inertia::render('joborders/create', [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_contact_person' => 'required|string|max:255',
            'company_department' => 'required|string|max:255',
            'company_contact_number' => 'required|string|max:255',
            'company_address' => 'required|string',
            'date_request' => 'required|date',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after_or_equal:date_start',
            'status' => 'required|in:open,in_progress,completed,cancelled',
            'priority' => 'required|in:low,medium,high,urgent',
            'type' => 'required|in:maintenance,repair,installation,inspection',
            'description' => 'nullable|string',
            'notes' => 'nullable|array',
            'notes.*.problem_description' => 'nullable|string',
            'notes.*.services_rendered' => 'nullable|string',
            'quotation' => 'nullable|array',
            'quotation.*.product_name' => 'nullable|string',
            'quotation.*.unit' => 'nullable|string',
            'quotation.*.qty' => 'nullable|numeric|min:0',
            'quotation.*.price' => 'nullable|numeric|min:0',
            'quotation.*.total' => 'nullable|numeric|min:0',
            'attachments' => 'nullable|array',
            'attachments.*.name' => 'nullable|string',
            'attachments.*.file_path' => 'nullable|string',
            'engineer_id' => 'nullable|exists:users,id',
            'engineer_supervisor_id' => 'nullable|exists:users,id',
            'company_manager_id' => 'nullable|exists:users,id',
            'engineer_signature' => 'nullable|string|max:255',
            'engineer_supervisor_signature' => 'nullable|string|max:255',
            'company_manager_signature' => 'nullable|string|max:255',
            'engineer_approved' => 'boolean',
            'engineer_supervisor_approved' => 'boolean',
            'company_manager_approved' => 'boolean',
        ]);

        try {
            // Generate unique job order number with today's date as prefix and incremental suffix
            $today = date('Y-m-d');
            $lastJobOrder = JobOrder::whereDate('created_at', $today)
                ->orderBy('id', 'desc')
                ->first();

            $suffix = 1;
            if ($lastJobOrder) {
                // Extract the suffix from the last job order number
                $lastNumber = $lastJobOrder->job_order_number;
                if (preg_match('/\d+$/', $lastNumber, $matches)) {
                    $suffix = intval($matches[0]) + 1;
                }
            }

            $validated['job_order_number'] = $today . '-JO-' . str_pad($suffix, 4, '0', STR_PAD_LEFT);

            $jobOrder = JobOrder::create($validated);

            return redirect()->route('joborders.show', $jobOrder)
                ->with('success', 'Job order created successfully.');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Failed to create job order. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(JobOrder $jobOrder)
    {
        $jobOrder->load(['engineer', 'engineerSupervisor', 'companyManager']);

        return Inertia::render('joborders/view', [
            'jobOrder' => $jobOrder
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, JobOrder $jobOrder)
    {
        $user = $request->user();

        // Check if user has admin or moderator role (full access)
        $userRoles = $user->roles->pluck('name')->toArray();
        $hasAdminOrModeratorRole = in_array('admin', $userRoles) || in_array('moderator', $userRoles);

        if ($hasAdminOrModeratorRole) {
            // Allow access for admin/moderator
        } else {
            // Check if user is assigned to this job order
            $isAssignedToJobOrder = $jobOrder->engineer_id === $user->id ||
                $jobOrder->engineer_supervisor_id === $user->id ||
                $jobOrder->company_manager_id === $user->id;

            if (!$isAssignedToJobOrder) {
                abort(403, 'You do not have permission to edit this job order. Only admins, moderators, or assigned engineers, supervisors, and managers can edit job orders.');
            }
        }

        $users = User::all();
        $jobOrder->load(['engineer', 'engineerSupervisor', 'companyManager']);

        return Inertia::render('joborders/edit', [
            'jobOrder' => $jobOrder,
            'users' => $users
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobOrder $jobOrder)
    {
        $user = $request->user();

        // Check if user has admin or moderator role (full access)
        $userRoles = $user->roles->pluck('name')->toArray();
        $hasAdminOrModeratorRole = in_array('admin', $userRoles) || in_array('moderator', $userRoles);

        if ($hasAdminOrModeratorRole) {
            // Allow access for admin/moderator
        } else {
            // Check if user is assigned to this job order
            $isAssignedToJobOrder = $jobOrder->engineer_id === $user->id ||
                $jobOrder->engineer_supervisor_id === $user->id ||
                $jobOrder->company_manager_id === $user->id;

            if (!$isAssignedToJobOrder) {
                abort(403, 'You do not have permission to edit this job order. Only admins, moderators, or assigned engineers, supervisors, and managers can edit job orders.');
            }
        }
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_contact_person' => 'required|string|max:255',
            'company_department' => 'required|string|max:255',
            'company_contact_number' => 'required|string|max:255',
            'company_address' => 'required|string',
            'date_request' => 'required|date',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after_or_equal:date_start',
            'status' => 'required|in:open,in_progress,completed,cancelled',
            'priority' => 'required|in:low,medium,high,urgent',
            'type' => 'required|in:maintenance,repair,installation,inspection',
            'description' => 'nullable|string',
            'notes' => 'nullable|array',
            'notes.*.problem_description' => 'nullable|string',
            'notes.*.services_rendered' => 'nullable|string',
            'quotation' => 'nullable|array',
            'quotation.*.product_name' => 'nullable|string',
            'quotation.*.unit' => 'nullable|string',
            'quotation.*.qty' => 'nullable|numeric|min:0',
            'quotation.*.price' => 'nullable|numeric|min:0',
            'quotation.*.total' => 'nullable|numeric|min:0',
            'attachments' => 'nullable|array',
            'attachments.*.name' => 'nullable|string',
            'attachments.*.file_path' => 'nullable|string',
            'engineer_id' => 'nullable|exists:users,id',
            'engineer_supervisor_id' => 'nullable|exists:users,id',
            'company_manager_id' => 'nullable|exists:users,id',
            'engineer_signature' => 'nullable|string|max:255',
            'engineer_supervisor_signature' => 'nullable|string|max:255',
            'company_manager_signature' => 'nullable|string|max:255',
            'engineer_approved' => 'boolean',
            'engineer_supervisor_approved' => 'boolean',
            'company_manager_approved' => 'boolean',
        ]);

        try {
            $jobOrder->update($validated);

            return redirect()->route('joborders.show', $jobOrder)
                ->with('success', 'Job order updated successfully.');
        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Failed to update job order. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobOrder $jobOrder)
    {
        try {
            $jobOrder->delete();

            return redirect()->route('joborders.index')
                ->with('success', 'Job order deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete job order. Please try again.');
        }
    }
}
