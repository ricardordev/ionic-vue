import { RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export const authGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
) => {
    const authStore = useAuthStore();

    if (!authStore.isInitialized) {
        await authStore.initializeAuth();
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return '/login';
    }

    if (to.path === '/login' && authStore.isAuthenticated) {
        return '/';
    }

    return true;
};
