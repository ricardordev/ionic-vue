<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center ion-absolute-center">Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <p class="ion-text-center ion-no-margin ion-margin-bottom">
        <ion-button class="custom-btn" fill="outline" expand="block" router-link="/list">Go to Post Listing</ion-button>
      </p>

      <p class="ion-text-center ion-no-margin ion-margin-bottom">
        <ion-button class="custom-btn" fill="outline" expand="block" router-link="/form">Go to Form Submiting</ion-button>
      </p>

      <div v-if="!authStore.isAuthenticated">
        <p class="ion-text-center ion-no-margin ion-margin-bottom">
          <ion-button class="custom-btn" fill="outline" expand="block" router-link="/login">Go to Login</ion-button>
        </p>
      </div>
      <div v-else>
        <p class="ion-text-center ion-no-margin ion-margin-bottom">
          <ion-button class="custom-btn" fill="outline" expand="block" router-link="/profile">Go to Profile</ion-button>
        </p>
      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped>
.custom-btn {
  --background: transparent;
  --background-activated: transparent;
  --border-width: 2px;
  --border-color: #a0a0a0;
  --color: #a0a0a0;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();
</script>
