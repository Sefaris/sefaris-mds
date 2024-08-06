import { createApp } from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import { i18n } from '../../../plugins/i18n';
import { createPinia } from 'pinia';

import '../assets/styles/tailwind.css';
import 'flag-icons/css/flag-icons.min.css';
import '@mdi/font/css/materialdesignicons.min.css';

const app = createApp(App);
const pinia = createPinia();
app.use(router).use(pinia).use(i18n).mount('#app');
