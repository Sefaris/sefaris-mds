import * as VueRouter from 'vue-router';

import HomeView from './views/HomeView.vue';
import ConfigurationView from './views/ConfigurationView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/configuration',
    name: 'Configuration',
    component: ConfigurationView,
  },
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
