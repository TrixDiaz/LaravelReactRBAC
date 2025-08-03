import { Pagination } from './pagination';
import { SingleRole } from './role_permission';

export interface SingleUser {
	id: number;
	name: string;
	email: string;
	roles: string[];
	permissions?: string[];
	created_at: string;
}

export interface User extends Pagination {
	data: SingleUser[];
}

export interface UserRole extends SingleUser {
	roles: SingleRole[];
}
