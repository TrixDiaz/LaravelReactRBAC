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
import { User } from '@/types/users';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, User as UserIcon } from 'lucide-react';
import { Icon } from '@/components/icon';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Users',
		href: '/users',
	},
];

export default function Users({ users }: { users: User }) {
	const { flash } = usePage<{ flash: { message?: string } }>().props;
	const { can } = usePermission();
	const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);
	const [ userToDelete, setUserToDelete ] = useState<{ id: number; name: string } | null>(null);

	useEffect(() => {
		if (flash.message) {
			toast.success(flash.message);
		}
	}, [ flash.message ]);

	function deleteUser(id: number) {
		router.delete(`/users/${id}`);
		setDeleteDialogOpen(false);
		setUserToDelete(null);
	}

	function openDeleteDialog(user: { id: number; name: string }) {
		setUserToDelete(user);
		setDeleteDialogOpen(true);
	}

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Users" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<CardTitle>Users Management</CardTitle>
						<CardAction>
							{can('create users') && (
								<Link href={'users/create'}>
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
									<TableHead className="font-bold text-white">Email</TableHead>
									<TableHead className="font-bold text-white">Roles</TableHead>
									<TableHead className="font-bold text-white">Created At</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.data.map((user, index) => (
									<ContextMenu key={user.id}>
										<ContextMenuTrigger asChild>
											<TableRow className="cursor-pointer hover:bg-muted/50">
												<TableCell className="w-16">
													<Link href={`/users/${user.id}`} className="block">
														{index + 1}
													</Link>
												</TableCell>
												<TableCell className="w-1/4">
													<Link href={`/users/${user.id}`} className="block hover:underline">
														{user.name}
													</Link>
												</TableCell>
												<TableCell className="w-1/3">
													<Link href={`/users/${user.id}`} className="block">
														{user.email}
													</Link>
												</TableCell>
												<TableCell className="w-1/4">
													<Link href={`/users/${user.id}`} className="block">
														<div className="flex flex-wrap items-center gap-2">
															{user.roles.map((role, index) => (
																<Badge variant={'outline'} key={index}>
																	{role}
																</Badge>
															))}
														</div>
													</Link>
												</TableCell>
												<TableCell className="w-1/6">
													<Link href={`/users/${user.id}`} className="block">
														{user.created_at}
													</Link>
												</TableCell>
											</TableRow>
										</ContextMenuTrigger>
										<ContextMenuContent>
											<ContextMenuItem asChild>
												<Link href={`/users/${user.id}`} className="flex items-center gap-2">
													<Icon iconNode={UserIcon} />
													View Details
												</Link>
											</ContextMenuItem>
											{can('update users') && (
												<ContextMenuItem asChild>
													<Link href={`/users/${user.id}/edit`} className="flex items-center gap-2">
														<Icon iconNode={Edit} />
														Edit
													</Link>
												</ContextMenuItem>
											)}
											{can('delete users') && (
												<ContextMenuItem
													variant="destructive"
													onClick={() => openDeleteDialog({ id: user.id, name: user.name })}
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
					{users.data.length > 0 ? (
						<TablePagination total={users.total} from={users.from} to={users.to} links={users.links} />
					) : (
						<div className="flex h-full items-center justify-center">No Results Found!</div>
					)}
				</Card>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete User</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={() => userToDelete && deleteUser(userToDelete.id)}>
							Delete User
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppLayout>
	);
}
