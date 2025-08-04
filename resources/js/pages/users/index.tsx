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
import { Edit, Search, Trash2, User as UserIcon } from 'lucide-react';
import { Icon } from '@/components/icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Users',
		href: '/users',
	},
];

export default function Users({ users, roles }: { users: User, roles: string[] }) {
	const { flash } = usePage<{ flash: { message?: string } }>().props;
	const { can } = usePermission();
	const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);
	const [ userToDelete, setUserToDelete ] = useState<{ id: number; name: string } | null>(null);
	const [ search, setSearch ] = useState('');
	const [ role, setRole ] = useState('');

	// Get current URL parameters to maintain filter state
	const urlParams = new URLSearchParams(window.location.search);
	const currentSearch = urlParams.get('search') || '';
	const currentRole = urlParams.get('role') || '';

	// Initialize state with current URL parameters
	useEffect(() => {
		setSearch(currentSearch);
		setRole(currentRole);
	}, [ currentSearch, currentRole ]);

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
						<div className="flex items-center gap-2">
							<Input
								type="text"
								placeholder="Search"
								value={search}
								className="flex-1 min-w-0"
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Select value={role} onValueChange={setRole}>
								<SelectTrigger className="w-40 flex-shrink-0">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									{roles.map((role) => (
										<SelectItem key={role} value={role}>
											{role}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								onClick={() => {
									const params: Record<string, string> = {};
									if (search) params.search = search;
									if (role) params.role = role;
									router.get('/users', params);
								}}
								className="flex-shrink-0"
							>
								<Search className="w-4 h-4" />
							</Button>
						</div>

						<Separator className="my-4" />
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
						{users.data.length > 0 ? (
							<TablePagination total={users.total} from={users.from} to={users.to} links={users.links} />
						) : (
							<div className="flex h-full items-center justify-center">No Results Found!</div>
						)}
					</CardContent>
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
		</AppLayout >
	);
}
