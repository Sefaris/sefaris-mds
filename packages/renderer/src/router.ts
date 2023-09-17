import type {RouteRecordRaw, Router} from 'vue-router';
import {createRouter, createWebHashHistory} from 'vue-router';

import HomeView from './views/HomeView.vue';
import ConfigurationView from './views/ConfigurationView.vue';
import {loadConfiguration} from '#preload';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    beforeEnter: (to, from, next) => {
      loadConfiguration().then(configuration => {
        if (!configuration) {
          next('/configuration');
          alert('Nie znaleziono konfiguracji. Proszę podać ścieżkę do folderu z grą.');
        } else {
          next();
        }
      });
    },
  },
  {
    path: '/configuration',
    name: 'Configuration',
    component: ConfigurationView,
  },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
