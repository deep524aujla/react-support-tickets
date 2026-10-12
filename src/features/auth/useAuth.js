import { useAuthStore } from '@/features/auth/authStore';
import { ROLE_PERMISSIONS } from '@/utils/constants';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const role = user?.role;
  function can(permission) {
    if (!role) {
      return false;
    }
    
    return ROLE_PERMISSIONS[role.slug].includes(permission);
  }

  function hasRole(...roles) {
    if (!role) {
      return false;
    }
    return roles.includes(role.slug);
  }

  return {
    user,
    token,
    role,
    isLoggedIn: Boolean(token && user),
    can,
    hasRole,
  };
}
