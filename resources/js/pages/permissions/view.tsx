import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { SinglePermission } from '@/types/role_permission';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, Key as KeyIcon } from 'lucide-react';
import { Icon } from '@/components/icon';
import { usePermission } from '@/hooks/user-permissions';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Permissions',
		href: '/permissions',
	},
	{
		title: 'View Permission',
		href: '#',
	},
];

export default function ViewPermission({ permission }: { permission: SinglePermission }) {
	const { flash } = usePage<{ flash: { message?: string } }>().props;
	const { can } = usePermission();
	const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);

	useEffect(() => {
		if (flash.message) {
			toast.success(flash.message);
		}
	}, [ flash.message ]);

	function deletePermission(id: number) {
		router.delete(`/permissions/${id}`);
		setDeleteDialogOpen(false);
	}

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`Permission - ${permission.name}`} />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				{/* Header with Actions */}
				<div className="flex items-center justify-between">
					<Link href="/permissions">
						<Button variant="outline" className="flex items-center gap-2">
							Back to Permissions
						</Button>
					</Link>
					<div className="flex gap-2">
						{can('update permissions') && (
							<Link href={`/permissions/${permission.id}/edit`}>
								<Button variant="default" className="flex items-center gap-2">
									<Icon iconNode={Edit} />
									Edit
								</Button>
							</Link>
						)}
						{can('delete permissions') && (
							<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
								<DialogTrigger asChild>
									<Button variant="destructive" className="flex items-center gap-2">
										<Icon iconNode={Trash2} />
										Delete
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Delete Permission</DialogTitle>
										<DialogDescription>
											Are you sure you want to delete <strong>{permission.name}</strong>? This action cannot be undone.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
											Cancel
										</Button>
										<Button variant="destructive" onClick={() => deletePermission(permission.id)}>
											Delete Permission
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						)}
					</div>
				</div>

				{/* Permission Details - Edit-like Layout */}
				<Card>
					<CardHeader>
						<CardTitle>Permission Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Basic Information */}
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium">Name</label>
								<div className="mt-1 p-3 bg-muted rounded-md border text-sm">
									{permission.name}
								</div>
							</div>
							<div>
								<label className="text-sm font-medium">Created At</label>
								<div className="mt-1 p-3 bg-muted rounded-md border text-sm">
									{permission.created_at}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
} 