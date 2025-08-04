import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { JobOrder, Note, QuotationItem, Attachment, User } from '@/types/joborders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { useRolePermissions } from '@/hooks/use-role-permissions';

interface Props {
  jobOrder: JobOrder;
  users: User[];
}

export default function JobOrdersEdit({ jobOrder, users }: Props) {
  const { hasRole, hasAnyRole } = useRolePermissions();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Job Orders',
      href: '/joborders',
    },
    {
      title: jobOrder.job_order_number,
      href: `/joborders/${jobOrder.id}`,
    },
    {
      title: 'Edit',
      href: `/joborders/${jobOrder.id}/edit`,
    },
  ];
  const [ notes, setNotes ] = useState<Note[]>(jobOrder.notes || [ { problem_description: '', services_rendered: '' } ]);
  const [ quotation, setQuotation ] = useState<QuotationItem[]>(jobOrder.quotation || [ { product_name: '', unit: '', qty: 1, price: 0, total: 0 } ]);
  const [ attachments, setAttachments ] = useState<Attachment[]>(jobOrder.attachments || [ { name: '', file_path: '' } ]);

  // Helper functions to determine field accessibility based on user role
  const isManagerOnly = hasRole('manager') && !hasAnyRole(['admin', 'moderator']);
  const canEditAllFields = hasAnyRole(['admin', 'moderator']);
  const canEditManagerFields = hasRole('manager') || hasAnyRole(['admin', 'moderator']);
  const canEditEngineerFields = hasRole('engineer') || hasAnyRole(['admin', 'moderator']);
  const canEditSupervisorFields = hasRole('supervisor') || hasAnyRole(['admin', 'moderator']);

  const { data, setData, put, processing, errors: formErrors } = useForm({
    company_name: jobOrder.company_name,
    company_contact_person: jobOrder.company_contact_person,
    company_department: jobOrder.company_department,
    company_contact_number: jobOrder.company_contact_number,
    company_address: jobOrder.company_address,
    date_request: jobOrder.date_request,
    date_start: jobOrder.date_start,
    date_end: jobOrder.date_end,
    status: jobOrder.status,
    priority: jobOrder.priority,
    type: jobOrder.type,
    description: jobOrder.description || '',
    notes: notes,
    quotation: quotation,
    attachments: attachments,
    engineer_id: jobOrder.engineer_id,
    engineer_supervisor_id: jobOrder.engineer_supervisor_id,
    company_manager_id: jobOrder.company_manager_id,
    engineer_signature: jobOrder.engineer_signature || '',
    engineer_supervisor_signature: jobOrder.engineer_supervisor_signature || '',
    company_manager_signature: jobOrder.company_manager_signature || '',
    engineer_approved: jobOrder.engineer_approved,
    engineer_supervisor_approved: jobOrder.engineer_supervisor_approved,
    company_manager_approved: jobOrder.company_manager_approved,
  });

  // Show validation errors as toast messages
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const errorMessages = Object.values(formErrors).flat();
      errorMessages.forEach(message => {
        toast.error(message as string);
      });
    }
  }, [formErrors]);

  // Update form data when notes, quotation, or attachments change
  useEffect(() => {
    setData('notes', notes);
  }, [ notes ]);

  useEffect(() => {
    setData('quotation', quotation);
  }, [ quotation ]);

  useEffect(() => {
    setData('attachments', attachments);
  }, [ attachments ]);

  const addNote = () => {
    setNotes([ ...notes, { problem_description: '', services_rendered: '' } ]);
  };

  const removeNote = (index: number) => {
    if (notes.length > 1) {
      const newNotes = notes.filter((_, i) => i !== index);
      setNotes(newNotes);
    }
  };

  const updateNote = (index: number, field: keyof Note, value: string) => {
    const newNotes = [ ...notes ];
    newNotes[ index ][ field ] = value;
    setNotes(newNotes);
  };

  const addQuotationItem = () => {
    setQuotation([ ...quotation, { product_name: '', unit: '', qty: 1, price: 0, total: 0 } ]);
  };

  const removeQuotationItem = (index: number) => {
    if (quotation.length > 1) {
      const newQuotation = quotation.filter((_, i) => i !== index);
      setQuotation(newQuotation);
    }
  };

  const updateQuotationItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    const newQuotation = [ ...quotation ];
    newQuotation[ index ][ field ] = value as any;

    // Auto-calculate total
    if (field === 'qty' || field === 'price') {
      newQuotation[ index ].total = newQuotation[ index ].qty * newQuotation[ index ].price;
    }

    setQuotation(newQuotation);
  };

  const addAttachment = () => {
    setAttachments([ ...attachments, { name: '', file_path: '' } ]);
  };

  const removeAttachment = (index: number) => {
    if (attachments.length > 1) {
      const newAttachments = attachments.filter((_, i) => i !== index);
      setAttachments(newAttachments);
    }
  };

  const updateAttachment = (index: number, field: keyof Attachment, value: string) => {
    const newAttachments = [ ...attachments ];
    newAttachments[ index ][ field ] = value;
    setAttachments(newAttachments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('joborders.update', jobOrder.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Job Order - ${jobOrder.job_order_number}`} />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Edit Job Order: {jobOrder.job_order_number}</CardTitle>
          </CardHeader>
          <hr />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={data.company_name}
                        onChange={(e) => setData('company_name', e.target.value)}
                        className={formErrors.company_name ? 'border-red-500' : ''}
                        disabled={isManagerOnly}
                      />
                      {formErrors.company_name && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.company_name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="company_contact_person">Contact Person</Label>
                      <Input
                        id="company_contact_person"
                        value={data.company_contact_person}
                        onChange={(e) => setData('company_contact_person', e.target.value)}
                        className={formErrors.company_contact_person ? 'border-red-500' : ''}
                        disabled={isManagerOnly}
                      />
                      {formErrors.company_contact_person && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.company_contact_person}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="company_department">Department</Label>
                      <Input
                        id="company_department"
                        value={data.company_department}
                        onChange={(e) => setData('company_department', e.target.value)}
                        className={formErrors.company_department ? 'border-red-500' : ''}
                        disabled={isManagerOnly}
                      />
                      {formErrors.company_department && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.company_department}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="company_contact_number">Contact Number</Label>
                      <Input
                        id="company_contact_number"
                        value={data.company_contact_number}
                        onChange={(e) => setData('company_contact_number', e.target.value)}
                        className={formErrors.company_contact_number ? 'border-red-500' : ''}
                        disabled={isManagerOnly}
                      />
                      {formErrors.company_contact_number && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.company_contact_number}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="company_address">Address</Label>
                      <Textarea
                        id="company_address"
                        value={data.company_address}
                        onChange={(e) => setData('company_address', e.target.value)}
                        className={formErrors.company_address ? 'border-red-500' : ''}
                        disabled={isManagerOnly}
                      />
                      {formErrors.company_address && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.company_address}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date_request">Date Request</Label>
                      <Input
                        id="date_request"
                        type="date"
                        value={data.date_request}
                        onChange={(e) => setData('date_request', e.target.value)}
                        className={formErrors.date_request ? 'border-red-500' : ''}
                        disabled={isManagerOnly}
                      />
                      {formErrors.date_request && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.date_request}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="date_start">Start Date</Label>
                      <Input
                        id="date_start"
                        type="date"
                        value={data.date_start}
                        onChange={(e) => setData('date_start', e.target.value)}
                        className={formErrors.date_start ? 'border-red-500' : ''}
                        disabled={isManagerOnly}
                      />
                      {formErrors.date_start && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.date_start}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="date_end">End Date</Label>
                      <Input
                        id="date_end"
                        type="date"
                        value={data.date_end}
                        onChange={(e) => setData('date_end', e.target.value)}
                        className={formErrors.date_end ? 'border-red-500' : ''}
                        disabled={isManagerOnly}
                      />
                      {formErrors.date_end && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.date_end}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={data.status} onValueChange={(value) => setData('status', value as any)} disabled={isManagerOnly}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={data.priority} onValueChange={(value) => setData('priority', value as any)} disabled={isManagerOnly}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={data.type} onValueChange={(value) => setData('type', value as any)} disabled={isManagerOnly}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="repair">Repair</SelectItem>
                          <SelectItem value="installation">Installation</SelectItem>
                          <SelectItem value="inspection">Inspection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={data.description || ''}
                      onChange={(e) => setData('description', e.target.value)}
                      className={formErrors.description ? 'border-red-500' : ''}
                      disabled={isManagerOnly}
                    />
                    {formErrors.description && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notes Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notes.map((note, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Note {index + 1}</h4>
                        {notes.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNote(index)}
                            disabled={isManagerOnly}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Problem Description</Label>
                          <Textarea
                            value={note.problem_description}
                            onChange={(e) => updateNote(index, 'problem_description', e.target.value)}
                            placeholder="Describe the problem..."
                            disabled={isManagerOnly}
                          />
                        </div>
                        <div>
                          <Label>Services Rendered</Label>
                          <Textarea
                            value={note.services_rendered}
                            onChange={(e) => updateNote(index, 'services_rendered', e.target.value)}
                            placeholder="Describe services rendered..."
                            disabled={isManagerOnly}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addNote} disabled={isManagerOnly}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                </CardContent>
              </Card>

              {/* Quotation Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quotation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Product Name</th>
                          <th className="text-left p-2">Unit</th>
                          <th className="text-left p-2">Qty</th>
                          <th className="text-left p-2">Price</th>
                          <th className="text-left p-2">Total</th>
                          <th className="text-left p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotation.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">
                              <Input
                                value={item.product_name}
                                onChange={(e) => updateQuotationItem(index, 'product_name', e.target.value)}
                                placeholder="Product name"
                                disabled={isManagerOnly}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                value={item.unit}
                                onChange={(e) => updateQuotationItem(index, 'unit', e.target.value)}
                                placeholder="Unit"
                                disabled={isManagerOnly}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                value={item.qty}
                                onChange={(e) => updateQuotationItem(index, 'qty', parseInt(e.target.value) || 0)}
                                placeholder="Qty"
                                disabled={isManagerOnly}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => updateQuotationItem(index, 'price', parseFloat(e.target.value) || 0)}
                                placeholder="Price"
                                disabled={isManagerOnly}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                value={item.total}
                                readOnly
                              />
                            </td>
                            <td className="p-2">
                              {quotation.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeQuotationItem(index)}
                                  disabled={isManagerOnly}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button type="button" variant="outline" onClick={addQuotationItem} disabled={isManagerOnly}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Attachments Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Label>File Name</Label>
                        <Input
                          value={attachment.name}
                          onChange={(e) => updateAttachment(index, 'name', e.target.value)}
                          placeholder="File name"
                          disabled={isManagerOnly}
                        />
                      </div>
                      <div className="flex-1">
                        <Label>File Path</Label>
                        <Input
                          value={attachment.file_path}
                          onChange={(e) => updateAttachment(index, 'file_path', e.target.value)}
                          placeholder="File path or URL"
                          disabled={isManagerOnly}
                        />
                      </div>
                      {attachments.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                          disabled={isManagerOnly}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addAttachment} disabled={isManagerOnly}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Attachment
                  </Button>
                </CardContent>
              </Card>

              {/* Footer Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignments & Approvals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="engineer_id">Engineer</Label>
                      <Select value={data.engineer_id ? data.engineer_id.toString() : ''} onValueChange={(value) => setData('engineer_id', value ? parseInt(value) : undefined)} disabled={isManagerOnly}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Engineer" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="engineer_supervisor_id">Supervisor</Label>
                      <Select value={data.engineer_supervisor_id ? data.engineer_supervisor_id.toString() : ''} onValueChange={(value) => setData('engineer_supervisor_id', value ? parseInt(value) : undefined)} disabled={isManagerOnly}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Supervisor" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="company_manager_id">Manager</Label>
                      <Select value={data.company_manager_id ? data.company_manager_id.toString() : ''} onValueChange={(value) => setData('company_manager_id', value ? parseInt(value) : undefined)} disabled={isManagerOnly}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="engineer_signature">Engineer Signature</Label>
                      <Input
                        id="engineer_signature"
                        value={data.engineer_signature || ''}
                        onChange={(e) => setData('engineer_signature', e.target.value)}
                        placeholder="Signature or initials"
                        disabled={isManagerOnly}
                      />
                    </div>
                    <div>
                      <Label htmlFor="engineer_supervisor_signature">Supervisor Signature</Label>
                      <Input
                        id="engineer_supervisor_signature"
                        value={data.engineer_supervisor_signature || ''}
                        onChange={(e) => setData('engineer_supervisor_signature', e.target.value)}
                        placeholder="Signature or initials"
                        disabled={isManagerOnly}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_manager_signature">Manager Signature</Label>
                      <Input
                        id="company_manager_signature"
                        value={data.company_manager_signature || ''}
                        onChange={(e) => setData('company_manager_signature', e.target.value)}
                        placeholder="Signature or initials"
                        disabled={!canEditManagerFields}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="engineer_approved"
                        checked={data.engineer_approved}
                        onCheckedChange={(checked) => setData('engineer_approved', checked === true)}
                        disabled={isManagerOnly}
                      />
                      <Label htmlFor="engineer_approved">Engineer Approved</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="engineer_supervisor_approved"
                        checked={data.engineer_supervisor_approved}
                        onCheckedChange={(checked) => setData('engineer_supervisor_approved', checked === true)}
                        disabled={isManagerOnly}
                      />
                      <Label htmlFor="engineer_supervisor_approved">Supervisor Approved</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="company_manager_approved"
                        checked={data.company_manager_approved}
                        onCheckedChange={(checked) => setData('company_manager_approved', checked === true)}
                        disabled={!canEditManagerFields}
                      />
                      <Label htmlFor="company_manager_approved">Manager Approved</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href={route('joborders.show', jobOrder.id)}>
                    Cancel
                  </Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Updating...' : 'Update Job Order'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 