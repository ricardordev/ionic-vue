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

      <form @submit="onSubmit">
        
        <ion-input
            label="Name"
            label-placement="floating"
            fill="outline"
            type="text"
            v-bind="name"
            :error-text="errors.name"
            :class="{ 'ion-invalid': errors.name, 'ion-touched': errors.name }"
            class="ion-margin-bottom"
        ></ion-input>

        <ion-input
            label="E-mail"
            label-placement="floating"
            fill="outline"
            type="email"
            inputmode="email"
            v-bind="email"
            :error-text="errors.email"
            :class="{ 'ion-invalid': errors.email, 'ion-touched': errors.email }"
            class="ion-margin-bottom"
        ></ion-input>

        <ion-select 
            label="Type"
            label-placement="floating"
            fill="outline"
            v-bind="type"
            :error-text="errors.type"
            :class="{ 'ion-invalid': errors.type, 'ion-touched': errors.type }"
            class="ion-margin-bottom" 
        >
            <ion-select-option value="Contact">Contact</ion-select-option>
            <ion-select-option value="Lead">Lead</ion-select-option>
        </ion-select>

        <ion-button type="submit" fill="outline" expand="block" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Submit</span>
          <ion-spinner v-else name="crescent"></ion-spinner>
        </ion-button>

      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonInput, IonSelect, IonSelectOption, IonButton, IonSpinner, toastController, IonIcon
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { ApiService } from '@/services/api.service';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const validationSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(2, { message: 'Name is too short.' }),
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Must be a valid email address.' }),
    type: z
      .string()
      .min(1, { message: 'Type is required.' }),
  })
);

const { errors, handleSubmit, defineComponentBinds } = useForm({
  validationSchema,
});

const name = defineComponentBinds('name');
const email = defineComponentBinds('email');
const type = defineComponentBinds('type');

interface ContactPayload {
  name: string;
  email: string;
  type: string;
}

interface ContactResponse {
  id: string;
  name: string;
  email: string;
  type: string;
  createdAt: string;
}

const isSubmitting = ref(false);

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    const response = await ApiService.post<ContactResponse, ContactPayload>('/contacts', values);
    const toast = await toastController.create({
      message: `Contact submitted successfully!`,
      duration: 2500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
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
});
</script>