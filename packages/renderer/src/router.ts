import type { RouteRecordRaw, Router } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

import HomeView from './views/HomeView.vue';
import ConfigView from './views/ConfigView.vue';
import OptionsView from './views/OptionsView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/config',
    name: 'Config',
    component: ConfigView,
  },
  {
    path: '/options/:ini',
    name: 'Options',
    component: OptionsView,
  },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
