import type { RouteRecordRaw, Router } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

import HomeView from './views/HomeView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    
  },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
