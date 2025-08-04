import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FingerprintIcon, ShieldCheckIcon, UsersIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ usersCount, rolesCount, permissionsCount }: { usersCount: number, rolesCount: number, permissionsCount: number }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Users</CardTitle>
                                <CardDescription>Total users in the system</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded-full">
                                            <UsersIcon className="size-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Total Users</div>
                                            <div className="text-2xl font-semibold">{usersCount}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                                        {usersCount} users
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Roles</CardTitle>
                                <CardDescription>Total Roles in the system</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded-full">
                                            <FingerprintIcon className="size-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Total Roles</div>
                                            <div className="text-2xl font-semibold">{rolesCount}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                                        {rolesCount} roles
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Permissions</CardTitle>
                                <CardDescription>Total Permissions in the system</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded-full">
                                            <ShieldCheckIcon className="size-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Total Permissions</div>
                                            <div className="text-2xl font-semibold">{permissionsCount}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                                        {permissionsCount} permissions
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
