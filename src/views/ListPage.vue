<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-button router-link="/" router-direction="back">
                <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
            </ion-button>
        </ion-buttons>

        <ion-title class="ion-text-center ion-absolute-center">Post Listing</ion-title>

        <ion-buttons slot="end">
          <ion-item lines="none">
            <ion-label style="font-size: 12px; margin-right: 8px;">Infinite</ion-label>
            <ion-toggle v-model="useInfiniteScroll" @ionChange="resetAndLoad"></ion-toggle>
          </ion-item>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Post Listing</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list v-if="isInitialLoad">
        <ion-item v-for="i in 5" :key="i">
          <ion-label>
            <h3><ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text></h3>
            <p><ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text></p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list v-else>
        <ion-item v-for="post in posts" :key="post.id" button>
          <ion-label class="ion-text-wrap">
            <h2>#{{ post.id }}. {{ post.title }}</h2>
            <p>{{ post.body }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-infinite-scroll 
        v-if="useInfiniteScroll" 
        @ionInfinite="loadData($event)"
      >
        <ion-infinite-scroll-content 
          loading-spinner="bubbles" 
          loading-text="Loading more posts...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>

    <ion-footer v-if="!useInfiniteScroll && !isInitialLoad">
      <ion-grid class="ion-no-margin">
        <ion-row class="ion-align-items-center ion-justify-content-between">
          <ion-col size="auto">
            <ion-button fill="outline" :disabled="offset === 0" @click="prevPage">
              Prev
            </ion-button>
          </ion-col>
          <ion-col size="auto">
            <ion-text>Page {{ (offset / limit) + 1 }}</ion-text>
          </ion-col>
          <ion-col size="auto">
            <ion-button fill="solid" :disabled="isEndOfData" @click="nextPage">
              Next
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons,
  IonList, IonFooter, IonItem, IonLabel, IonSkeletonText, onIonViewWillEnter, IonIcon,
  IonToggle, IonInfiniteScroll, IonInfiniteScrollContent, IonGrid, IonRow, IonCol, IonText
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { ApiService } from '@/services/api.service';

// Defining interface for posts
interface Post {
  id: number;
  title: string;
  body: string;
}

const posts = ref<Post[]>([]);
const limit = ref(10);
const offset = ref(0);
const isInitialLoad = ref(true);
const useInfiniteScroll = ref(true);
const isEndOfData = ref(false);

const fetchPosts = async (isAppending = false) => {
  if (!isAppending) isInitialLoad.value = true;

  try {
    // get method
    const response = await ApiService.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?_limit=${limit.value}&_start=${offset.value}`);

    // business rule based on $limit: if API returns empty, last page was the end
    if(!isAppending && response.length === 0) {
      offset.value -= limit.value;
      isEndOfData.value = true;
      return;
    }

    // business rule based on $limit: if API returns less than $limit, it's the end
    if (response.length < limit.value) {
      isEndOfData.value = true;
    }

    if (isAppending) {
      // spread syntax (...) to keep vue reactivity
      posts.value = [...posts.value, ...response];
    } else {
      // replace old data with new data
      posts.value = response;
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    isInitialLoad.value = false;
  }
};

// infinite scroll handler
const loadData = async (event: any) => {
  if (isEndOfData.value) {
    event.target.disabled = true; // turn off the native infinite scroll
    return;
  }
  offset.value += limit.value;
  await fetchPosts(true); // true = append
  event.target.complete(); // hide the native spinner
};

// pagination handlers
const nextPage = () => {
  if (isEndOfData.value) return;
  offset.value += limit.value;
  fetchPosts(false);
};

const prevPage = () => {
  if (offset.value === 0) return;
  offset.value -= limit.value;
  isEndOfData.value = false; // reset the flag in case he goes back one page
  fetchPosts(false);
};

// toggle method
const resetAndLoad = () => {
  posts.value = [];
  offset.value = 0;
  isEndOfData.value = false;
  fetchPosts(false);
};

// strategic hook to load posts when the view is about to enter
onIonViewWillEnter(() => {
  resetAndLoad();
});
</script>