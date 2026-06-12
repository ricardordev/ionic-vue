import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

export const authGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const authStore = useAuthStore();

    if (!authStore.isInitialized) {
        await authStore.initializeAuth();
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    }
    else if (to.path === '/login' && authStore.isAuthenticated) {
        next('/');
    }
    else {
        next();
    }
};