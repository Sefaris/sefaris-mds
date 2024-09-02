<template>
  <title-bar />
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import TitleBar from './components/TitleBar.vue';
import { i18n } from '../../../plugins/i18n';
import { loadConfiguration } from '#preload';
import type { SUPPORTED_LANGUAGES } from '../../../utils/constants';
import { DEFAULT_LANGUAGE } from '../../../utils/constants';
export default defineComponent({
  components: { TitleBar },
  setup() {
    onMounted(async () => {
      const configuration = await loadConfiguration();
      if (configuration) {
        i18n.global.locale.value = configuration.language as SUPPORTED_LANGUAGES;
      } else {
        i18n.global.locale.value = DEFAULT_LANGUAGE;
      }
      window.addEventListener('message', code => {
        // TODO: use ports instead of postmessage
        // temporary
        if (code.data.includes('pl') || code.data.includes('gb') || code.data.includes('ru')) {
          i18n.global.locale.value = code.data;
        }
      });
    });
    return {};
  },
});
</script>
