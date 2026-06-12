<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-button router-link="/" router-direction="back">
                <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
            </ion-button>
        </ion-buttons>

        <ion-title class="ion-text-center ion-absolute-center">Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Login</ion-title>
        </ion-toolbar>
      </ion-header>

      <form @submit.prevent="submitForm">
        
        <ion-input
            label="Username"
            label-placement="floating"
            fill="outline"
            type="text"
            v-model="formData.username"
            :error-text="errors.username"
            :class="{ 'ion-invalid': errors.username, 'ion-touched': errors.username }"
            @ionInput="clearError('username')"
            class="ion-margin-bottom"
        ></ion-input>

        <ion-input
            label="Password"
            label-placement="floating"
            fill="outline"
            type="password"
            v-model="formData.password"
            :error-text="errors.password"
            :class="{ 'ion-invalid': errors.password, 'ion-touched': errors.password }"
            @ionInput="clearError('password')"
            class="ion-margin-bottom"
        ></ion-input>

        <ion-button type="submit" fill="outline" expand="block" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Submit</span>
          <ion-spinner v-else name="crescent"></ion-spinner>
        </ion-button>

      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonInput, IonButton, IonSpinner, toastController, IonIcon,
  useIonRouter
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { useAuthStore } from '@/stores/auth.store';

// Instanciando dependências
const authStore = useAuthStore();
const ionRouter = useIonRouter();

const formData = reactive({
  username: 'emilys', // Usuário padrão da DummyJSON para facilitar seu teste
  password: 'emilyspass'
});

const errors = reactive({
  username: '',
  password: ''
});

const isSubmitting = ref(false);

const clearError = (field: keyof typeof errors) => {
  errors[field] = '';
};

const validateForm = (): boolean => {
  let isValid = true;
  if (!formData.username.trim()) {
    errors.username = 'Username is required.';
    isValid = false;
  }
  if (!formData.password.trim()) {
    errors.password = 'Password is required.';
    isValid = false;
  }
  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    // Delegação! O componente não sabe como a API funciona. Ele confia no Store.
    const success = await authStore.login({
      username: formData.username,
      password: formData.password
    });
    
    if (success) {
      const toast = await toastController.create({
        message: 'Login successful!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

      ionRouter.replace('/'); 
    } else {
      const toast = await toastController.create({
        message: 'Invalid username or password.',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
    
  } catch (error) {
    const toast = await toastController.create({
      message: 'Invalid username or password.',
      duration: 3000,
      color: 'danger',
    });
    await toast.present();
  } finally {
    isSubmitting.value = false;
  }
};
</script>