import { useAuth } from './useAuth';

export interface UseAdminReturn {
  isAdmin: boolean;
  canAccessAdminFeatures: boolean;
  requireAdmin: (callback: () => void) => void;
  ifAdmin: (callback: () => void) => void;
}

/**
 * Hook for admin role detection and admin-only functionality
 */
export function useAdmin(): UseAdminReturn {
  const { isAdmin, isAuthenticated } = useAuth();

  const canAccessAdminFeatures = isAuthenticated && isAdmin;

  const requireAdmin = (callback: () => void) => {
    if (!canAccessAdminFeatures) {
      throw new Error('Admin access required');
    }
    callback();
  };

  const ifAdmin = (callback: () => void) => {
    if (canAccessAdminFeatures) {
      callback();
    }
  };

  return {
    isAdmin,
    canAccessAdminFeatures,
    requireAdmin,
    ifAdmin,
  };
}
