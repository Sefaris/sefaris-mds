import { createApp } from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import { i18n } from '/@/plugins/i18n';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();
app.use(router).use(pinia).use(i18n).mount('#app');
