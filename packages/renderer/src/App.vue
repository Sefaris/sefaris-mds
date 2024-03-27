<template>
  <title-bar />
  <nav-bar />
  <router-view></router-view>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import TitleBar from './components/TitleBar.vue';
import NavBar from './components/NavBar.vue';
import {onMounted} from 'vue';
import {loadConfiguration} from '#preload';
import {i18n} from './plugins/i18n';
import type {SUPPORTED_LANGUAGES} from './plugins/i18n';
export default defineComponent({
  components: {TitleBar, NavBar},
  setup() {
    onMounted(async () => {
      const config = await loadConfiguration();
      if (config) {
        i18n.global.locale.value = config.language as SUPPORTED_LANGUAGES;
      } else {
        alert('Error loading configuration');
        i18n.global.locale.value = 'gb';
      }
    });

    return {};
  },
});
</script>

<style lang="scss">
@import '../assets/styles/main.scss';

#app {
  height: calc(100vh - 30px);
  max-width: 100vw;
}
</style>
