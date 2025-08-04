import InputError from '@/components/input-error';
import TablePagination from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { usePermission } from '@/hooks/user-permissions';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Permission, SinglePermission } from '@/types/role_permission';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Loader2, Edit, Trash2, Key as KeyIcon, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Icon } from '@/components/icon';
import { Separator } from '@radix-ui/react-separator';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Permissions',
		href: '/permissions',
	},
];

export default function Permissions({ permissions }: { permissions: Permission }) {
	const [ openAddPermissionDialog, setOpenAddPermissionDialog ] = useState(false);
	const [ openEditPermissionDialog, setOpenEditPermissionDialog ] = useState(false);
	const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);
	const [ permissionToDelete, setPermissionToDelete ] = useState<{ id: number; name: string } | null>(null);
	const { flash } = usePage<{ flash: { message?: string } }>().props;
	const { can } = usePermission();
	const [ search, setSearch ] = useState('');


	useEffect(() => {
		if (flash.message) {
			setOpenAddPermissionDialog(false);
			setOpenEditPermissionDialog(false);
			toast.success(flash.message);
		}
	}, [ flash.message ]);

	const {
		data,
		setData,
		post,
		put,
		delete: destroy,
		processing,
		errors,
		reset,
	} = useForm({
		id: 0,
		name: '',
	});

	function submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		post('/permissions', {
			onSuccess: () => {
				reset('name');
			},
		});
	}

	function edit(permission: SinglePermission) {
		setData('name', permission.name);
		setData('id', permission.id);
		setOpenEditPermissionDialog(true);
	}

	function update(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		put(`/permissions/${data.id}`);
	}

	function deletePermission(id: number) {
		destroy(`/permissions/${id}`);
		setDeleteDialogOpen(false);
		setPermissionToDelete(null);
	}

	function openDeleteDialog(permission: { id: number; name: string }) {
		setPermissionToDelete(permission);
		setDeleteDialogOpen(true);
	}

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Permissions" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<CardTitle>Permissions Management</CardTitle>
						<CardAction>
							{can('create permissions') && (
								<Button
									variant={'default'}
									onClick={() => {
										setOpenAddPermissionDialog(true);
									}}
								>
									Add New
								</Button>
							)}
						</CardAction>
					</CardHeader>
					<hr />
					<CardContent>
						<div className="flex items-center justify-between gap-2">
							<Input
								type="text"
								placeholder="Search"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button onClick={() => router.get('/permissions', { search })}>
								<Search className="w-4 h-4" />
							</Button>
						</div>
						<Separator className="my-4" />
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="font-bold text-white">ID</TableHead>
									<TableHead className="font-bold text-white">Name</TableHead>
									<TableHead className="font-bold text-white">Created At</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{permissions.data.map((permission, index) => (
									<ContextMenu key={permission.id}>
										<ContextMenuTrigger asChild>
											<TableRow className="cursor-pointer hover:bg-muted/50">
												<TableCell className="w-16">
													<Link href={`/permissions/${permission.id}`} className="block">
														{index + 1}
													</Link>
												</TableCell>
												<TableCell className="w-1/2">
													<Link href={`/permissions/${permission.id}`} className="block hover:underline">
														{permission.name}
													</Link>
												</TableCell>
												<TableCell className="w-1/3">
													<Link href={`/permissions/${permission.id}`} className="block">
														{permission.created_at}
													</Link>
												</TableCell>
											</TableRow>
										</ContextMenuTrigger>
										<ContextMenuContent>
											<ContextMenuItem asChild>
												<Link href={`/permissions/${permission.id}`} className="flex items-center gap-2">
													<Icon iconNode={KeyIcon} />
													View Details
												</Link>
											</ContextMenuItem>
											{can('update permissions') && (
												<ContextMenuItem asChild>
													<Link href={`/permissions/${permission.id}/edit`} className="flex items-center gap-2">
														<Icon iconNode={Edit} />
														Edit
													</Link>
												</ContextMenuItem>
											)}
											{can('delete permissions') && (
												<ContextMenuItem
													variant="destructive"
													onClick={() => openDeleteDialog({ id: permission.id, name: permission.name })}
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
					{permissions.data.length > 0 ? (
						<TablePagination total={permissions.total} from={permissions.from} to={permissions.to} links={permissions.links} />
					) : (
						<div className="flex h-full items-center justify-center">No Results Found!</div>
					)}
				</Card>

				{/* add new permission dialog start */}
				<Dialog open={openAddPermissionDialog} onOpenChange={setOpenAddPermissionDialog}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Add New Permission</DialogTitle>
						</DialogHeader>
						<hr />
						<form onSubmit={submit}>
							<div className="grid gap-4">
								<div className="grid gap-3">
									<Label htmlFor="name">Permission Name</Label>
									<Input
										id="name"
										type="text"
										value={data.name}
										onChange={(e) => setData('name', e.target.value)}
										aria-invalid={!!errors.name}
									/>
									<InputError message={errors.name} />
								</div>
							</div>
							<DialogFooter className="mt-4">
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button type="submit" disabled={processing}>
									{processing && <Loader2 className="animate-spin" />}
									<span>Create</span>
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
				{/* add new permission dialog end */}

				{/* edit permission dialog start */}
				<Dialog open={openEditPermissionDialog} onOpenChange={setOpenEditPermissionDialog}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit Permission</DialogTitle>
						</DialogHeader>
						<hr />
						<form onSubmit={update}>
							<div className="grid gap-4">
								<div className="grid gap-3">
									<Label htmlFor="name">Permission Name</Label>
									<Input
										id="name"
										type="text"
										value={data.name}
										onChange={(e) => setData('name', e.target.value)}
										aria-invalid={!!errors.name}
									/>
									<InputError message={errors.name} />
								</div>
							</div>
							<DialogFooter className="mt-4">
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button type="submit" disabled={processing}>
									{processing && <Loader2 className="animate-spin" />}
									<span>Update</span>
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
				{/* edit permission dialog end */}

				{/* Delete Confirmation Dialog */}
				<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete Permission</DialogTitle>
							<DialogDescription>
								Are you sure you want to delete <strong>{permissionToDelete?.name}</strong>? This action cannot be undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
								Cancel
							</Button>
							<Button variant="destructive" onClick={() => permissionToDelete && deletePermission(permissionToDelete.id)}>
								Delete Permission
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</AppLayout>
	);
}
