import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { SecureService } from '@/services/secure.service';
import { ApiService } from '@/services/api.service';

// user interface
interface User {
    id: string;
    name: string;
    email: string;
}

export const useAuthStore = defineStore('auth', () => {
    // state
    const token = ref<string | null>(null);
    const user = ref<User | null>(null);
    const isInitialized = ref<boolean>(false); // avoid race conditions

    // getters
    const isAuthenticated = computed(() => !!token.value);

    // actions

    /**
     * async initialization before app startup
     */
    async function initializeAuth() {
        if (isInitialized.value) return;

        try {
            const savedToken = await SecureService.getToken();
            const savedUserStr = await SecureService.getUserData();

            if (savedToken && savedUserStr) {
                token.value = savedToken;
                user.value = JSON.parse(savedUserStr);
            }
        } catch (error) {
            console.error('Failed to read secure data:', error);
            await clearAuthData();
        } finally {
            isInitialized.value = true;
        }
    }

    /**
     * Login with success
     */
    async function login(credentials: { username: string; password: string }) {
        try {
            // the responsibility of hitting the API and validating can stay here in the Store
            const response = await ApiService.post<{
                accessToken: string;
                refreshToken: string;
                id: number;
                username: string;
                email: string;
                firstName: string;
                lastName: string;
            }>(import.meta.env.VITE_LOGIN_URL, credentials);

            const loggedUser: User = {
                id: String(response.id),
                name: `${response.firstName} ${response.lastName}`,
                email: response.email,
            };

            // 1. Update the screen immediately (RAM)
            token.value = response.accessToken;
            user.value = loggedUser;

            // 2. Grava no cofre do dispositivo (Disco) em background
            await SecureService.setToken(response.accessToken);
            await SecureService.setUserData(JSON.stringify(loggedUser));

            return true;
        } catch (error) {
            console.error('Login refused by API:', error);
            return false;
        }
    }

    /**
     * Logout action
     */
    async function logout() {
        await clearAuthData();
    }

    /**
     * clean and secure the data
     */
    async function clearAuthData() {
        token.value = null;
        user.value = null;
        await SecureService.clearAll();
    }

    // public api
    return {
        token,
        user,
        isInitialized,
        isAuthenticated,
        initializeAuth,
        login,
        logout
    };
});