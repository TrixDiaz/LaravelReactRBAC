<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
	// index method
	public function index(Request $request)
	{

		$permissions = Permission::latest()->paginate(5)->withQueryString();
		$permissions->getCollection()->transform(function ($permission) {
			return [
				'id' => $permission->id,
				'name' => $permission->name,
				'created_at' => $permission->created_at->format('d-m-Y')
			];
		});

		$query = Permission::query();

		if ($request->filled('search')) {
			$query->where('name', 'like', '%' . $request->get('search') . '%');
		}

		$permissions = $query->orderBy('created_at', 'desc')->paginate(10);

		return Inertia::render('permissions/index', [
			'permissions' => $permissions
		]);
	}

	// show method
	public function show(Permission $permission)
	{
		$permissionData = [
			'id' => $permission->id,
			'name' => $permission->name,
			'created_at' => $permission->created_at->format('d-m-Y')
		];

		return Inertia::render('permissions/view', [
			'permission' => $permissionData
		]);
	}

	// edit method
	public function edit(Permission $permission)
	{
		$permissionData = [
			'id' => $permission->id,
			'name' => $permission->name,
			'created_at' => $permission->created_at->format('d-m-Y')
		];

		return Inertia::render('permissions/edit', [
			'permission' => $permissionData
		]);
	}

	// store method
	public function store(Request $request)
	{
		Permission::create($request->validate([
			'name' => ['required', 'string', 'max:255', 'unique:permissions,name']
		]));

		return to_route('permissions.index')->with('message', 'Permission Created Successfully!');
	}

	// update method
	public function update(Request $request, Permission $permission)
	{
		$permission->update($request->validate([
			'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
		]));

		return to_route('permissions.index')->with('message', 'Permission Updated Successfully!');
	}

	// destroy method
	public function destroy(Permission $permission)
	{
		$permission->delete();
		return to_route('permissions.index')->with('message', 'Permission Deleted Successfully!');
	}
}
