import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Capacitor } from '@capacitor/core';

// keys names - consistent naming
const STORAGE_KEYS = {
    TOKEN: 'auth_jwt',
    USER: 'auth_user'
};

export const SecureService = {

    // token management
    async setToken(token: string): Promise<boolean> {
        try {
            await SecureStoragePlugin.set({ key: STORAGE_KEYS.TOKEN, value: token });
            return true;
        } catch (error) {
            console.error('Erro ao salvar token seguro:', error);
            return false;
        }
    },

    async getToken(): Promise<string | null> {
        try {
            const result = await SecureStoragePlugin.get({ key: STORAGE_KEYS.TOKEN });
            return result.value;
        } catch (error) {
            return null;
        }
    },

    // user management
    async setUserData(userDataStr: string): Promise<boolean> {
        try {
            await SecureStoragePlugin.set({ key: STORAGE_KEYS.USER, value: userDataStr });
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    },

    async getUserData(): Promise<string | null> {
        try {
            const result = await SecureStoragePlugin.get({ key: STORAGE_KEYS.USER });
            return result.value;
        } catch (error) {
            return null;
        }
    },

    // clearting data
    async clearAll(): Promise<void> {
        try {
            await SecureStoragePlugin.remove({ key: STORAGE_KEYS.TOKEN });
            await SecureStoragePlugin.remove({ key: STORAGE_KEYS.USER });
            console.log('Session destroyed successfully from native vault.');
        } catch (error) {
            console.error('Error clearing authentication data:', error);
        }
    },

    // utils
    isSecureEnvironment(): boolean {
        return Capacitor.isNativePlatform();
    }
};