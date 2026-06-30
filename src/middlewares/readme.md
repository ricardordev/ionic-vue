on src/main.ts
import { createPinia } from 'pinia'

...

const pinia = createPinia();

const app = createApp(App)
    .use(IonicVue)
    .use(pinia) // inject
    .use(router);

******

on src/router/index.ts:
import { authGuard } from '@/middlewares/guards';

add to router to protect:

{
    path: 'tab3',
    component: () => import('@/views/Tab3Page.vue'),
    meta: {
      requiresAuth: true
    }
}

add before export default router:

router.beforeEach(authGuard);