<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$query = User::query();

		$roles = Role::all()->pluck('name');

		if ($request->filled('search')) {
			$query->where('name', 'like', '%' . $request->get('search') . '%');
		}

		if ($request->filled('role')) {
			$query->whereHas('roles', function ($roleQuery) use ($request) {
				$roleQuery->where('name', $request->get('role'));
			});
		}

		$users = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

		$users = $users->through(function ($user) {
			return [
				'id' => $user->id,
				'name' => $user->name,
				'email' => $user->email,
				'created_at' => $user->created_at->format('d-m-Y'),
				'roles' => $user->roles->pluck('name')
			];
		});

		return Inertia::render('users/index', [
			'users' => $users,
			'roles' => $roles
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return Inertia::render('users/create', [
			'roles' => Role::all()->pluck('name')
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		$request->validate([
			'name' => 'required|string|max:255',
			'email' => 'required|email|unique:users,email',
			'password' => 'required|string|min:8',
			'roles' => 'array',
			'roles.*' => 'string|exists:roles,name'
		]);

		$user = User::create([
			'name' => $request->name,
			'email' => $request->email,
			'password' => bcrypt($request->password),
		]);

		if ($request->roles) {
			$user->syncRoles($request->roles);
		}

		return to_route('users.index')->with('message', 'User Created Successfully!');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(User $user)
	{
		$userData = [
			'id' => $user->id,
			'name' => $user->name,
			'email' => $user->email,
			'created_at' => $user->created_at->format('d-m-Y'),
			'roles' => $user->roles->pluck('name'),
			'permissions' => $user->getAllPermissions()->pluck('name')
		];

		return Inertia::render('users/view', [
			'user' => $userData
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(User $user)
	{
		return Inertia::render('users/edit', [
			'user' => $user->load('roles'),
			'roles' => Role::all()->pluck('name')
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, User $user)
	{
		$request->validate([
			'name' => 'required|string|max:255',
			'email' => 'required|email|unique:users,email,' . $user->id,
			'roles' => 'array',
			'roles.*' => 'string|exists:roles,name'
		]);

		$user->update([
			'name' => $request->name,
			'email' => $request->email
		]);

		if ($request->roles) {
			$user->syncRoles($request->roles);
		}

		return to_route('users.index')->with('message', 'User Updated Successfully!');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(User $user)
	{
		$user->delete();
		return to_route('users.index')->with('message', 'User Deleted Successfully!');
	}
}
