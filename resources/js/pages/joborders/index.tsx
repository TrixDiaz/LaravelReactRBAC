import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { JobOrder } from '@/types/joborders';
import { Pagination } from '@/types/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Plus, Eye, Pencil, Search, Filter, X, Trash2 } from 'lucide-react';
import TablePagination from '@/components/table-pagination';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/user-permissions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Job Orders',
        href: '/joborders',
    },
];

interface Props {
    jobOrders: Pagination & { data: JobOrder[] };
    filters: {
        search?: string;
        status?: string;
        priority?: string;
        type?: string;
    };
}

export default function JobOrdersIndex({ jobOrders, filters }: Props) {
    const { flash } = usePage<{ flash: { message?: string; error?: string } }>().props;
    const { can } = usePermission();
    const [ search, setSearch ] = useState(filters.search || '');
    const [ statusFilter, setStatusFilter ] = useState(filters.status || 'all');
    const [ priorityFilter, setPriorityFilter ] = useState(filters.priority || 'all');
    const [ typeFilter, setTypeFilter ] = useState(filters.type || 'all');
    const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);
    const [ jobOrderToDelete, setJobOrderToDelete ] = useState<{ id: number; job_order_number: string } | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [ flash.message, flash.error ]);

    const getStatusBadge = (status: string) => {
        const variants = {
            open: 'default',
            in_progress: 'secondary',
            completed: 'outline',
            cancelled: 'destructive',
        } as const;

        return (
            <Badge variant={variants[ status as keyof typeof variants ] || 'default'}>
                {status.replace('_', ' ').toUpperCase()}
            </Badge>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const variants = {
            low: 'default',
            medium: 'secondary',
            high: 'outline',
            urgent: 'destructive',
        } as const;

        return (
            <Badge variant={variants[ priority as keyof typeof variants ] || 'default'}>
                {priority.toUpperCase()}
            </Badge>
        );
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
        if (priorityFilter && priorityFilter !== 'all') params.append('priority', priorityFilter);
        if (typeFilter && typeFilter !== 'all') params.append('type', typeFilter);

        window.location.href = `/joborders?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setPriorityFilter('all');
        setTypeFilter('all');
        window.location.href = '/joborders';
    };

    const hasActiveFilters = search || (statusFilter && statusFilter !== 'all') || (priorityFilter && priorityFilter !== 'all') || (typeFilter && typeFilter !== 'all');

    const handleDelete = () => {
        if (jobOrderToDelete) {
            router.delete(route('joborders.destroy', jobOrderToDelete.id));
            setDeleteDialogOpen(false);
            setJobOrderToDelete(null);
        }
    };

    const openDeleteDialog = (jobOrder: { id: number; job_order_number: string }) => {
        setJobOrderToDelete(jobOrder);
        setDeleteDialogOpen(true);
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Job Orders" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <Card>
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle>Job Orders</CardTitle>
                            <CardAction>
                                {can('create job order') && (
                                    <Button asChild>
                                        <Link href={route('joborders.create')}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Job Order
                                        </Link>
                                    </Button>
                                )}
                            </CardAction>
                        </CardHeader>
                        <hr />

                        {/* Search and Filters */}
                        <CardContent className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" />
                                        <Input
                                            placeholder="Search job orders..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="open">Open</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priority</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="repair">Repair</SelectItem>
                                            <SelectItem value="installation">Installation</SelectItem>
                                            <SelectItem value="inspection">Inspection</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleSearch} variant="outline">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filter
                                    </Button>
                                    {hasActiveFilters && (
                                        <Button onClick={clearFilters} variant="outline">
                                            <X className="mr-2 h-4 w-4" />
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Active Filters Display */}
                            {hasActiveFilters && (
                                <div className="flex flex-wrap gap-2">
                                    {search && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            Search: {search}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch('')} />
                                        </Badge>
                                    )}
                                    {statusFilter && statusFilter !== 'all' && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            Status: {statusFilter}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter('all')} />
                                        </Badge>
                                    )}
                                    {priorityFilter && priorityFilter !== 'all' && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            Priority: {priorityFilter}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => setPriorityFilter('all')} />
                                        </Badge>
                                    )}
                                    {typeFilter && typeFilter !== 'all' && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            Type: {typeFilter}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => setTypeFilter('all')} />
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </CardContent>

                        <CardHeader>
                            <CardTitle>All Job Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Job Order #</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Contact Person</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Engineer</TableHead>
                                        <TableHead>Date Request</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jobOrders.data.map((jobOrder) => (
                                        <ContextMenu key={jobOrder.id}>
                                            <ContextMenuTrigger asChild>
                                                <TableRow
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => window.location.href = route('joborders.show', jobOrder.id)}
                                                >
                                                    <TableCell>
                                                        {jobOrder.job_order_number}
                                                    </TableCell>
                                                    <TableCell>{jobOrder.company_name}</TableCell>
                                                    <TableCell>{jobOrder.company_contact_person}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {jobOrder.type.toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(jobOrder.status)}</TableCell>
                                                    <TableCell>{getPriorityBadge(jobOrder.priority)}</TableCell>
                                                    <TableCell>
                                                        {jobOrder.engineer?.name || 'Not assigned'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(jobOrder.date_request).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            </ContextMenuTrigger>
                                            <ContextMenuContent>
                                                <ContextMenuItem asChild>
                                                    <Link href={route('joborders.show', jobOrder.id)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </ContextMenuItem>
                                                {can('update job order') && (
                                                    <ContextMenuItem asChild>
                                                        <Link href={route('joborders.edit', jobOrder.id)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit Job Order
                                                        </Link>
                                                    </ContextMenuItem>
                                                )}
                                                {can('delete job order') && (
                                                    <ContextMenuItem
                                                        variant="destructive"
                                                        onClick={() => openDeleteDialog({ id: jobOrder.id, job_order_number: jobOrder.job_order_number })}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Job Order
                                                    </ContextMenuItem>
                                                )}
                                            </ContextMenuContent>
                                        </ContextMenu>
                                    ))}
                                </TableBody>
                            </Table>

                            <TablePagination {...jobOrders} />
                        </CardContent>
                    </Card>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Job Order</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete <strong>{jobOrderToDelete?.job_order_number}</strong>? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Delete Job Order
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AppLayout>
        </>
    );
}
