import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { JobOrder } from '@/types/joborders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/user-permissions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
  jobOrder: JobOrder;
}

export default function JobOrdersView({ jobOrder }: Props) {
  const { flash } = usePage<{ flash: { message?: string; error?: string } }>().props;
  const { can } = usePermission();
  const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false);

  // Handle flash messages
  useEffect(() => {
    if (flash.message) {
      toast.success(flash.message);
    }
    if (flash.error) {
      toast.error(flash.error);
    }
  }, [ flash.message, flash.error ]);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Job Orders',
      href: '/joborders',
    },
    {
      title: jobOrder.job_order_number,
      href: `/joborders/${jobOrder.id}`,
    },
  ];

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateQuotationTotal = () => {
    if (!jobOrder.quotation) return 0;
    return jobOrder.quotation.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleDelete = () => {
    router.delete(route('joborders.destroy', jobOrder.id));
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Job Order - ${jobOrder.job_order_number}`} />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Job Order: {jobOrder.job_order_number}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('joborders.index')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              {can('update job order') && (
                <Button asChild>
                  <Link href={route('joborders.edit', jobOrder.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Job Order
                  </Link>
                </Button>
              )}
              {can('delete job order') && (
                <Button variant="destructive" onClick={openDeleteDialog}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Job Order
                </Button>
              )}
            </div>
          </CardHeader>
          <hr />
          <CardContent className="space-y-6">

            {/* Company Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company Name</label>
                    <p className="text-sm">{jobOrder.company_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person</label>
                    <p className="text-sm">{jobOrder.company_contact_person}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="text-sm">{jobOrder.company_department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="text-sm">{jobOrder.company_contact_number}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm">{jobOrder.company_address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date Request</label>
                    <p className="text-sm">{formatDate(jobOrder.date_request)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Start Date</label>
                    <p className="text-sm">{formatDate(jobOrder.date_start)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">End Date</label>
                    <p className="text-sm">{formatDate(jobOrder.date_end)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(jobOrder.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <div className="mt-1">{getPriorityBadge(jobOrder.priority)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <Badge variant="outline" className="mt-1">
                      {jobOrder.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {jobOrder.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm mt-1">{jobOrder.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes Card */}
            {jobOrder.notes && jobOrder.notes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobOrder.notes.map((note, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <h4 className="font-medium">Note {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Problem Description</label>
                          <p className="text-sm mt-1">{note.problem_description}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Services Rendered</label>
                          <p className="text-sm mt-1">{note.services_rendered}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quotation Card */}
            {jobOrder.quotation && jobOrder.quotation.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Quotation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">Product Name</th>
                          <th className="text-left p-2 font-medium">Unit</th>
                          <th className="text-left p-2 font-medium">Qty</th>
                          <th className="text-left p-2 font-medium">Price</th>
                          <th className="text-left p-2 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobOrder.quotation.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 text-sm">{item.product_name}</td>
                            <td className="p-2 text-sm">{item.unit}</td>
                            <td className="p-2 text-sm">{item.qty}</td>
                            <td className="p-2 text-sm">${item.price?.toFixed(2)}</td>
                            <td className="p-2 text-sm font-medium">${item.total?.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2">
                          <td colSpan={4} className="p-2 text-right font-medium">Total:</td>
                          <td className="p-2 font-bold">${calculateQuotationTotal().toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attachments Card */}
            {jobOrder.attachments && jobOrder.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobOrder.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-sm text-gray-500">{attachment.file_path}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={attachment.file_path} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Footer Card */}
            <Card>
              <CardHeader>
                <CardTitle>Assignments & Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Engineer</label>
                    <p className="text-sm">{jobOrder.engineer?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Supervisor</label>
                    <p className="text-sm">{jobOrder.engineer_supervisor?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Manager</label>
                    <p className="text-sm">{jobOrder.company_manager?.name || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Engineer Signature</label>
                    <p className="text-sm">{jobOrder.engineer_signature || 'Not signed'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Supervisor Signature</label>
                    <p className="text-sm">{jobOrder.engineer_supervisor_signature || 'Not signed'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Manager Signature</label>
                    <p className="text-sm">{jobOrder.company_manager_signature || 'Not signed'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={jobOrder.engineer_approved} disabled />
                    <label className="text-sm font-medium">Engineer Approved</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={jobOrder.engineer_supervisor_approved} disabled />
                    <label className="text-sm font-medium">Supervisor Approved</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={jobOrder.company_manager_approved} disabled />
                    <label className="text-sm font-medium">Manager Approved</label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{jobOrder.job_order_number}</strong>? This action cannot be undone.
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
  );
} 