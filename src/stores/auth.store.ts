import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Preferences } from '@capacitor/preferences'; // or secure storage

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
            const { value } = await Preferences.get({ key: 'auth_token' });
            const savedUser = await Preferences.get({ key: 'auth_user' });

            if (value && savedUser.value) {
                token.value = value;
                user.value = JSON.parse(savedUser.value);
            }
        } catch (error) {
            console.error('Failed to read native authentication data:', error);
            await clearAuthData();
        } finally {
            isInitialized.value = true;
        }
    }

    /**
     * Login with success
     */
    async function login(newToken: string, userData: User) {
        token.value = newToken;
        user.value = userData;

        // save the data in native device
        await Preferences.set({ key: 'auth_token', value: newToken });
        await Preferences.set({ key: 'auth_user', value: JSON.stringify(userData) });
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
        await Preferences.remove({ key: 'auth_token' });
        await Preferences.remove({ key: 'auth_user' });
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