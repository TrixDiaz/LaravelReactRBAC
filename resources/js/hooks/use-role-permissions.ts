import { usePage } from '@inertiajs/react';

type AuthProps = {
    auth?: {
        user?: {
            id?: number;
            roles?: Array<{
                name: string;
            }>;
        };
        permissions?: string[];
    };
};

export function useRolePermissions() {
    const { props } = usePage<AuthProps>();
    const userRoles = props.auth?.user?.roles?.map(role => role.name) || [];
    const permissions = props.auth?.permissions || [];

    const can = (permission: string): boolean => permissions.includes(permission);

    const hasRole = (role: string): boolean => userRoles.includes(role);

    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => userRoles.includes(role));
    };

    const canEditJobOrder = (jobOrder?: { engineer_id?: number; engineer_supervisor_id?: number; company_manager_id?: number }): boolean => {
        // Check if user has admin or moderator role (full access)
        const hasAdminOrModeratorRole = hasAnyRole([ 'admin', 'moderator' ]);

        if (hasAdminOrModeratorRole) {
            return true;
        }

        // If no job order provided, we can't determine assignment-based access
        if (!jobOrder) {
            return false;
        }

        // Check if user is assigned to this specific job order
        const currentUserId = props.auth?.user?.id;
        if (!currentUserId) {
            return false;
        }

        const isAssignedToJobOrder = jobOrder.engineer_id === currentUserId ||
            jobOrder.engineer_supervisor_id === currentUserId ||
            jobOrder.company_manager_id === currentUserId;

        return isAssignedToJobOrder;
    };

    const canDeleteJobOrder = (): boolean => {
        // Only admin and moderator can delete job orders
        return hasAnyRole([ 'admin', 'moderator' ]);
    };

    return {
        can,
        hasRole,
        hasAnyRole,
        canEditJobOrder,
        canDeleteJobOrder,
        userRoles
    };
} 