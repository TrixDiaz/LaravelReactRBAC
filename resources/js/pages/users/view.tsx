import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { User } from '@/types/users';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, User as UserIcon, Mail, Calendar, Shield, Key } from 'lucide-react';
import { Icon } from '@/components/icon';
import { usePermission } from '@/hooks/user-permissions';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'View User',
        href: '#',
    },
];

export default function ViewUser({ user }: { user: User }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const { can } = usePermission();
    const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [ flash.message ]);

    function deleteUser(id: number) {
        router.delete(`/users/${id}`);
        setDeleteDialogOpen(false);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User - ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header with Actions */}
                <div className="flex items-center justify-between">
                    <Link href="/users">
                        <Button variant="outline" className="flex items-center gap-2">
                            Back to Users
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        {can('update users') && (
                            <Link href={`/users/${user.id}/edit`}>
                                <Button variant="default" className="flex items-center gap-2">
                                    <Icon iconNode={Edit} />
                                    Edit
                                </Button>
                            </Link>
                        )}
                        {can('delete users') && (
                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="flex items-center gap-2">
                                        <Icon iconNode={Trash2} />
                                        Delete
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete User</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={() => deleteUser(user.id)}>
                                            Delete User
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>

                {/* User Details - Edit-like Layout */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Name</label>
                                <div className="mt-1 p-3 bg-muted rounded-md border text-sm">
                                    {user.name}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <div className="mt-1 p-3 bg-muted rounded-md border text-sm">
                                    {user.email}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Created At</label>
                                <div className="mt-1 p-3 bg-muted rounded-md border text-sm">
                                    {user.created_at}
                                </div>
                            </div>
                        </div>

                        {/* Roles Section */}
                        <div>
                            <label className="text-sm font-medium">Roles</label>
                            <div className="mt-2">
                                {user.roles && user.roles.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.map((role, index) => (
                                            <Badge key={index} variant="secondary" className="text-sm">
                                                {role}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No roles assigned</p>
                                )}
                            </div>
                        </div>

                        {/* Permissions Section */}
                        <div>
                            <label className="text-sm font-medium">Permissions</label>
                            <div className="mt-2">
                                {user.permissions && user.permissions.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.permissions.map((permission, index) => (
                                            <Badge key={index} variant="outline" className="text-sm">
                                                {permission}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No direct permissions assigned</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 