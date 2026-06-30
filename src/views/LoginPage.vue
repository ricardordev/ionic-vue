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

      <form @submit="onSubmit">
        
        <ion-input
            label="Username"
            label-placement="floating"
            placeholder="emilys"
            fill="outline"
            type="text"
            v-bind="username"
            :error-text="errors.username"
            :class="{ 'ion-invalid': errors.username, 'ion-touched': errors.username }"
            class="ion-margin-bottom"
        ></ion-input>

        <ion-input
            label="Password"
            label-placement="floating"
            placeholder="emilyspass"
            fill="outline"
            type="password"
            v-bind="password"
            :error-text="errors.password"
            :class="{ 'ion-invalid': errors.password, 'ion-touched': errors.password }"
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
import { ref } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonInput, IonButton, IonSpinner, toastController, IonIcon,
  useIonRouter
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { useAuthStore } from '@/stores/auth.store';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

// Initializing dependencies
const authStore = useAuthStore();
const ionRouter = useIonRouter();

const validationSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(2, { message: 'Username is too short.' }),
    password: z
      .string()
      .min(1, { message: 'Password is required.' })
  })
);

const { errors, handleSubmit, defineComponentBinds } = useForm({
  validationSchema,
});

const username = defineComponentBinds('username');
const password = defineComponentBinds('password');

const isSubmitting = ref(false);


const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    const success = await authStore.login({
      username: values.username,
      password: values.password
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
});
</script>