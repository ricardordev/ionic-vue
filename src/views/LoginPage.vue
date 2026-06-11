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
            label="Login"
            label-placement="floating"
            fill="outline"
            type="text"
            v-model="formData.login"
            :error-text="errors.login"
            :class="{ 'ion-invalid': errors.login, 'ion-touched': errors.login }"
            @ionInput="clearError('login')"
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
  IonInput, IonButton, IonSpinner, toastController, IonIcon
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { ApiService } from '@/services/api.service';

interface LoginPayload {
  login: string;
  password: string;
}

interface LoginResponse {
  id: string;
  login: string;
  createdAt: string;
}

// form state
const formData = reactive<LoginPayload>({
  login: '',
  password: ''
});

// errors state
const errors = reactive({
  login: '',
  password: ''
});

const isSubmitting = ref(false);

// clear error on input/change
const clearError = (field: keyof typeof errors) => {
  errors[field] = '';
};

// manual validation
const validateForm = (): boolean => {
  let isValid = true;
  
  if (!formData.login.trim()) {
    errors.login = 'Login is required.';
    isValid = false;
  }

  if (!formData.password.trim()) {
    errors.password = 'Password is required.';
    isValid = false;
  }

  return isValid;
};

// Disparo da Ação
const submitForm = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    // call post method
    const response = await ApiService.post<LoginResponse, typeof formData>('/login', formData);
    
    // show success toast
    const toast = await toastController.create({
      message: `Login successful!`,
      duration: 2500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    // clean form
    formData.login = '';
    formData.password = '';
  } catch (error) {
    console.error('Error submitting form:', error);
    const toast = await toastController.create({
      message: 'Error submitting form. Please try again.',
      duration: 3000,
      color: 'danger',
    });
    await toast.present();
  } finally {
    isSubmitting.value = false;
  }
};
</script>