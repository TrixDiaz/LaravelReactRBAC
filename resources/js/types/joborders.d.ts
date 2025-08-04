export interface JobOrder {
  id: number;
  job_order_number: string;
  company_name: string;
  company_contact_person: string;
  company_department: string;
  company_contact_number: string;
  company_address: string;
  date_request: string;
  date_start: string;
  date_end: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'maintenance' | 'repair' | 'installation' | 'inspection';
  description?: string;
  notes?: Note[];
  quotation?: QuotationItem[];
  attachments?: Attachment[];
  engineer_id?: number;
  engineer_supervisor_id?: number;
  company_manager_id?: number;
  engineer_signature?: string;
  engineer_supervisor_signature?: string;
  company_manager_signature?: string;
  engineer_approved: boolean;
  engineer_supervisor_approved: boolean;
  company_manager_approved: boolean;
  created_at: string;
  updated_at: string;
  engineer?: User;
  engineer_supervisor?: User;
  company_manager?: User;
}

export interface Note {
  id?: string;
  problem_description: string;
  services_rendered: string;
  [key: string]: string | number | boolean | undefined;
}

export interface QuotationItem {
  id?: string;
  product_name: string;
  unit: string;
  qty: number;
  price: number;
  total: number;
  [key: string]: string | number | boolean | undefined;
}

export interface Attachment {
  id?: string;
  name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface JobOrderFormData {
  company_name: string;
  company_contact_person: string;
  company_department: string;
  company_contact_number: string;
  company_address: string;
  date_request: string;
  date_start: string;
  date_end: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'maintenance' | 'repair' | 'installation' | 'inspection';
  description?: string;
  notes: Note[];
  quotation: QuotationItem[];
  attachments: Attachment[];
  engineer_id?: number;
  engineer_supervisor_id?: number;
  company_manager_id?: number;
  engineer_signature?: string;
  engineer_supervisor_signature?: string;
  company_manager_signature?: string;
  engineer_approved: boolean;
  engineer_supervisor_approved: boolean;
  company_manager_approved: boolean;
  [key: string]: string | number | boolean | undefined;
} 