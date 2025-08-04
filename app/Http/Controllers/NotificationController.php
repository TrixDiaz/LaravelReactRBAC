<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                $data = $notification->data;
                return [
                    'id' => $notification->id,
                    'title' => $data['title'] ?? 'Notification',
                    'body' => $data['body'] ?? '',
                    'read' => $notification->read_at !== null,
                    'time' => $notification->created_at->diffForHumans(),
                    'type' => $data['type'] ?? null,
                ];
            });

        return Inertia::render('notifications/index', [
            'notifications' => $notifications
        ]);
    }

    public function markAsRead(Request $request, DatabaseNotification $notification)
    {
        // Ensure the notification belongs to the authenticated user
        if ($notification->notifiable_id !== $request->user()->id) {
            abort(403);
        }

        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return back();
    }

    public function destroy(Request $request, DatabaseNotification $notification)
    {
        // Ensure the notification belongs to the authenticated user
        if ($notification->notifiable_id !== $request->user()->id) {
            abort(403);
        }

        $notification->delete();

        return back();
    }

    public function destroyAll(Request $request)
    {
        $request->user()
            ->notifications()
            ->delete();

        return back();
    }
}
