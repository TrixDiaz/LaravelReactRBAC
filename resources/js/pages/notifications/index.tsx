import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { BellIcon, CheckIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Notification } from "@/types";

interface NotificationsProps {
    notifications: Notification[];
}

export default function Notifications({ notifications = [] }: NotificationsProps) {
    const breadcrumbs = [
        { label: 'Notifications', href: route('notifications.index'), title: 'Notifications' }
    ];

    const handleMarkAllAsRead = () => {
        router.post(route('notifications.markAllAsRead'), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // You can optionally show a toast or re-fetch
            }
        });
    };

    const handleDeleteAll = () => {
        router.delete(route('notifications.destroyAll'), {
            preserveScroll: true,
            onSuccess: () => {
                // You can optionally show a toast or re-fetch
            }
        });
    };

    const handleDeleteNotification = (notificationId: number) => {
        router.delete(route('notifications.destroy', notificationId), {
            preserveScroll: true,
            onSuccess: () => {
                // You can optionally show a toast or re-fetch
            }
        });
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Notifications" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <BellIcon className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleMarkAllAsRead}>
                                    <CheckIcon className="mr-2 h-4 w-4" />
                                    Mark all as read
                                </Button>
                                {notifications.length > 0 && (
                                    <Button variant="outline" onClick={handleDeleteAll} className="text-red-600 hover:text-red-700">
                                        <Trash2Icon className="mr-2 h-4 w-4" />
                                        Delete all
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {notifications.length > 0 ? (
                                notifications.map((notification, idx) => (
                                    <div key={idx} className="rounded-md border p-3 shadow-sm flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium">{notification.title}</div>
                                            <div className="text-sm text-muted-foreground">{notification.body}</div>
                                            <div className="text-xs text-gray-400">{notification.time}</div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.post(route('notifications.markAsRead', notification.id))
                                                    }
                                                >
                                                    Mark as read
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteNotification(notification.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-muted-foreground py-6">
                                    No notifications available.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
