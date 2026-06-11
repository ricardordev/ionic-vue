<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-button router-link="/" router-direction="back">
                <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
            </ion-button>
        </ion-buttons>

        <ion-title class="ion-text-center ion-absolute-center">Form Submiting</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Form Submiting</ion-title>
        </ion-toolbar>
      </ion-header>

      <form @submit.prevent="submitForm">
        
        <ion-input
            label="Name"
            label-placement="floating"
            fill="outline"
            type="text"
            v-model="formData.name"
            :error-text="errors.name"
            :class="{ 'ion-invalid': errors.name, 'ion-touched': errors.name }"
            @ionInput="clearError('name')"
            class="ion-margin-bottom"
        ></ion-input>

        <ion-input
            label="E-mail"
            label-placement="floating"
            fill="outline"
            type="email"
            inputmode="email"
            v-model="formData.email"
            :error-text="errors.email"
            :class="{ 'ion-invalid': errors.email, 'ion-touched': errors.email }"
            @ionInput="clearError('email')"
            class="ion-margin-bottom"
        ></ion-input>

        <ion-select 
            label="Type"
            label-placement="floating"
            fill="outline"
            v-model="formData.type"
            :error-text="errors.type"
            :class="{ 'ion-invalid': errors.type, 'ion-touched': errors.type }"
            @ionChange="clearError('type')"
            class="ion-margin-bottom" 
        >
            <ion-select-option value="Contact">Contact</ion-select-option>
            <ion-select-option value="Lead">Lead</ion-select-option>
        </ion-select>

        <ion-button type="submit" expand="block" :disabled="isSubmitting">
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
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
  IonInput, IonSelect, IonSelectOption, IonButton, IonSpinner, toastController, IonIcon
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { ApiService } from '@/services/api.service';

interface ContactPayload {
  name: string;
  email: string;
  type: 'contact' | 'lead' | '';
}

interface ContactResponse {
  id: string;
  name: string;
  email: string;
  type: string;
  createdAt: string;
}

// form state
const formData = reactive<ContactPayload>({
  name: '',
  email: '',
  type: ''
});

// errors state
const errors = reactive({
  name: '',
  email: '',
  type: ''
});

const isSubmitting = ref(false);

// clear error on input/change
const clearError = (field: keyof typeof errors) => {
  errors[field] = '';
};

// manual validation
const validateForm = (): boolean => {
  let isValid = true;
  
  if (!formData.name.trim()) {
    errors.name = 'Name is required.';
    isValid = false;
  }
  
  // regular regex to validate e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = 'E-mail is required.';
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address.';
    isValid = false;
  }

  if (!formData.type) {
    errors.type = 'Type is required.';
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
    const response = await ApiService.post<ContactResponse, typeof formData>('/contacts', formData);
    
    // show success toast
    const toast = await toastController.create({
      message: `Contact submitted successfully!`,
      duration: 2500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    // clean form
    formData.name = '';
    formData.email = '';
    formData.type = '';
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