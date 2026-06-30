<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-button router-link="/" router-direction="back">
                <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
            </ion-button>
        </ion-buttons>

        <ion-title class="ion-text-center ion-absolute-center">Profile Page</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">
        <ion-header collapse="condense">
            <ion-toolbar>
                <ion-title size="large">Profile Page</ion-title>
            </ion-toolbar>
        </ion-header>

        <div class="profile-card">
            <div class="avatar">{{ userInitials }}</div>
            <p class="name">{{ authStore.user?.name }}</p>
            <p class="email">{{ authStore.user?.email }}</p>
        </div>

        <p class="ion-text-center ion-no-margin ion-margin-bottom">
            <ion-button color="danger" fill="outline" expand="block" @click="logout">Logout</ion-button>
        </p>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const userInitials = computed(() => {
  if (!authStore.user?.name) return '?';
  return authStore.user.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');
});

const logout = async () => {
  await authStore.logout();
  router.replace('/');
};
</script>

<style scoped>
.profile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 32px 16px;
}

.avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #6b6b6b;
    color: #f4f4f4;
    font-size: 24px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
}

.name {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    color: var(--ion-color-dark);
}

.email {
    margin: 0;
    font-size: 14px;
    color: var(--ion-color-medium);
}
</style>