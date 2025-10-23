<?php

use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\JobOrderController;
use App\Http\Controllers\NotificationController;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
	return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
	Route::get('dashboard', function () {
		$usersCount = User::count();
		$rolesCount = Role::count();
		$permissionsCount = Permission::count();

		return Inertia::render('dashboard', compact('usersCount', 'rolesCount', 'permissionsCount'));
	})->name('dashboard');

	// notifications routes
	Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
	Route::post('notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
	Route::post('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
	Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
	Route::delete('notifications', [NotificationController::class, 'destroyAll'])->name('notifications.destroyAll');

	// permissions routes
	Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index')->can('view any permissions');
	Route::get('/permissions/{permission}', [PermissionController::class, 'show'])->name('permissions.show')->can('view any permissions');
	Route::get('/permissions/{permission}/edit', [PermissionController::class, 'edit'])->name('permissions.edit')->can('update permissions');
	Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store')->can('create permissions');
	Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update')->can('update permissions');
	Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy')->can('delete permissions');

	// roles routes
	Route::get('/roles', [RoleController::class, 'index'])->name('roles.index')->can('view any roles');
	Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create')->can('create roles');
	Route::post('/roles', [RoleController::class, 'store'])->name('roles.store')->can('create roles');
	Route::get('/roles/{role}', [RoleController::class, 'show'])->name('roles.show')->can('view any roles');
	Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit')->can('update roles');
	Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update')->can('update roles');
	Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy')->can('delete roles');

	// users routes
	Route::get('/users', [UserController::class, 'index'])->name('users.index')->can('view any users');
	Route::get('/users/create', [UserController::class, 'create'])->name('users.create')->can('create users');
	Route::post('/users', [UserController::class, 'store'])->name('users.store')->can('create users');
	Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show')->can('view any users');
	Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit')->can('update users');
	Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update')->can('update users');
	Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy')->can('delete users');

	// job orders routes
	Route::get('/joborders', [JobOrderController::class, 'index'])->name('joborders.index')->can('view any job order');
	Route::get('/joborders/create', [JobOrderController::class, 'create'])->name('joborders.create')->can('create job order');
	Route::post('/joborders', [JobOrderController::class, 'store'])->name('joborders.store')->can('create job order');
	Route::get('/joborders/{jobOrder}', [JobOrderController::class, 'show'])->name('joborders.show')->can('view any job order');
	Route::get('/joborders/{jobOrder}/edit', [JobOrderController::class, 'edit'])->name('joborders.edit')->middleware('check.joborder.edit');
	Route::put('/joborders/{jobOrder}', [JobOrderController::class, 'update'])->name('joborders.update')->middleware('check.joborder.edit');
	Route::delete('/joborders/{jobOrder}', [JobOrderController::class, 'destroy'])->name('joborders.destroy')->middleware('check.joborder.delete');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
