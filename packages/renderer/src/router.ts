import type { RouteRecordRaw, Router } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';

import HomeView from './views/HomeView.vue';
import OptionListView from './views/OptionListView.vue';
import OptionView from './views/OptionView.vue';
import StarterOptionsView from './views/StarterOptionsView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/option-list',
    name: 'OptionList',
    component: OptionListView,
  },
  {
    path: '/starter-options',
    name: 'StarterOptions',
    component: StarterOptionsView,
  },
  {
    path: '/option/:ini',
    name: 'Option',
    component: OptionView,
  },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
