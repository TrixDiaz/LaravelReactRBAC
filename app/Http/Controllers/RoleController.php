<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$query = Role::with('permissions');

		if ($request->filled('search')) {
			$query->where('name', 'like', '%' . $request->get('search') . '%');
		}

		$roles = $query->orderBy('created_at', 'desc')->paginate(10);
		return Inertia::render('roles/index', [
			'roles' => $roles->through(function ($role) {
				return [
					'id' => $role->id,
					'name' => $role->name,
					'created_at' => $role->created_at->format('d-m-Y'),
					'permissions' => $role->permissions->pluck('name')
				];
			}),
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return Inertia::render('roles/create', [
			'permissions' => Permission::all()->pluck('name'),
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		$request->validate([
			'name' => 'required|string|max:255|unique:roles,name',
			'permissions' => 'array',
			'permissions.*' => 'string|exists:permissions,name'
		]);

		$role = Role::create([
			'name' => $request->name
		]);

		if ($request->has('permissions')) {
			$role->syncPermissions($request->permissions);
		}

		return to_route('roles.index')->with('message', 'Role Created Successfully!');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Role $role)
	{
		$roleData = [
			'id' => $role->id,
			'name' => $role->name,
			'created_at' => $role->created_at->format('d-m-Y'),
			'permissions' => $role->permissions->pluck('name')
		];

		return Inertia::render('roles/view', [
			'role' => $roleData
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Role $role)
	{
		return Inertia::render('roles/edit', [
			'role' => $role->load('permissions'),
			'permissions' => Permission::all()->pluck('name')
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, Role $role)
	{
		$request->validate([
			'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
			'permissions' => 'array',
			'permissions.*' => 'string|exists:permissions,name'
		]);

		$role->name = $request->name;
		$role->save();

		if ($request->has('permissions')) {
			$role->syncPermissions($request->permissions);
		}

		return to_route('roles.index')->with('message', 'Role Updated Successfully!');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Role $role)
	{
		$role->delete();
		return to_route('roles.index')->with('message', 'Role Deleted Successfully!');
	}
}
