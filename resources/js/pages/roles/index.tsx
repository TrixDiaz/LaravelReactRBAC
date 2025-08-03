import TablePagination from '@/components/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePermission } from '@/hooks/user-permissions';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Role } from '@/types/role_permission';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, Shield as ShieldIcon } from 'lucide-react';
import { Icon } from '@/components/icon';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Roles',
		href: '/roles',
	},
];

export default function Roles({ roles }: { roles: Role }) {
	const { flash } = usePage<{ flash: { message?: string } }>().props;
	const { can } = usePermission();
	const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);
	const [ roleToDelete, setRoleToDelete ] = useState<{ id: number; name: string } | null>(null);

	useEffect(() => {
		if (flash.message) {
			toast.success(flash.message);
		}
	}, [ flash.message ]);

	function deleteRole(id: number) {
		router.delete(`/roles/${id}`);
		setDeleteDialogOpen(false);
		setRoleToDelete(null);
	}

	function openDeleteDialog(role: { id: number; name: string }) {
		setRoleToDelete(role);
		setDeleteDialogOpen(true);
	}

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Roles" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<CardTitle>Roles Management</CardTitle>
						<CardAction>
							{can('create roles') && (
								<Link href={'roles/create'}>
									<Button variant={'default'}>Add New</Button>
								</Link>
							)}
						</CardAction>
					</CardHeader>
					<hr />
					<CardContent>
						<Table>
							<TableHeader className="">
								<TableRow>
									<TableHead className="font-bold text-white">ID</TableHead>
									<TableHead className="font-bold text-white">Name</TableHead>
									<TableHead className="font-bold text-white">Permissions</TableHead>
									<TableHead className="font-bold text-white">Created At</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{roles.data.map((role, index) => (
									<ContextMenu key={role.id}>
										<ContextMenuTrigger asChild>
											<TableRow className="cursor-pointer hover:bg-muted/50">
												<TableCell className="w-16">
													<Link href={`/roles/${role.id}`} className="block">
														{index + 1}
													</Link>
												</TableCell>
												<TableCell className="w-1/4">
													<Link href={`/roles/${role.id}`} className="block hover:underline">
														{role.name}
													</Link>
												</TableCell>
												<TableCell className="w-1/3">
													<Link href={`/roles/${role.id}`} className="block">
														<div className="flex flex-wrap items-center gap-2">
															{role.permissions.map((perm, index) => (
																<Badge variant={'outline'} key={index}>
																	{perm}
																</Badge>
															))}
														</div>
													</Link>
												</TableCell>
												<TableCell className="w-1/6">
													<Link href={`/roles/${role.id}`} className="block">
														{role.created_at}
													</Link>
												</TableCell>
											</TableRow>
										</ContextMenuTrigger>
										<ContextMenuContent>
											<ContextMenuItem asChild>
												<Link href={`/roles/${role.id}`} className="flex items-center gap-2">
													<Icon iconNode={ShieldIcon} />
													View Details
												</Link>
											</ContextMenuItem>
											{can('update roles') && (
												<ContextMenuItem asChild>
													<Link href={`/roles/${role.id}/edit`} className="flex items-center gap-2">
														<Icon iconNode={Edit} />
														Edit
													</Link>
												</ContextMenuItem>
											)}
											{can('delete roles') && (
												<ContextMenuItem
													variant="destructive"
													onClick={() => openDeleteDialog({ id: role.id, name: role.name })}
													className="flex items-center gap-2"
												>
													<Icon iconNode={Trash2} />
													Delete
												</ContextMenuItem>
											)}
										</ContextMenuContent>
									</ContextMenu>
								))}
							</TableBody>
						</Table>
					</CardContent>
					{roles.data.length > 0 ? (
						<TablePagination total={roles.total} from={roles.from} to={roles.to} links={roles.links} />
					) : (
						<div className="flex h-full items-center justify-center">No Results Found!</div>
					)}
				</Card>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Role</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete <strong>{roleToDelete?.name}</strong>? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={() => roleToDelete && deleteRole(roleToDelete.id)}>
							Delete Role
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppLayout>
	);
}
