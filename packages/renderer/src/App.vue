<template>
  <div
    v-for="(bg, index) in backgrounds"
    :key="index"
    class="bg-slide"
    :class="{ active: index === currentBg }"
    :style="{ backgroundImage: `url(${bg})` }"
  />
  <div class="bg-overlay" />
  <div class="app-content">
    <title-bar />
    <router-view class="flex min-h-0 flex-1 flex-col" />
    <alert-modal
      :is-visible="isModalVisible"
      :type="modalType"
      :title="modalTitle"
      :message="modalMessage"
      :show-log-button="showLogButton"
      @close="isModalVisible = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import TitleBar from './components/TitleBar.vue';
import { i18n } from '../../../plugins/i18n';
import { loadConfiguration } from '#preload';
import type { SUPPORTED_LANGUAGES } from '../../../utils/constants';
import { DEFAULT_LANGUAGE } from '../../../utils/constants';
import AlertModal from './components/AlertModal.vue';

import bg0 from '../assets/images/background-0.webp';
import bg1 from '../assets/images/background-1.webp';
import bg2 from '../assets/images/background-2.webp';

export default defineComponent({
  components: { TitleBar, AlertModal },
  setup() {
    const isModalVisible = ref(false);
    const modalType = ref<string>();
    const modalTitle = ref('');
    const modalMessage = ref('');
    const showLogButton = ref(false);

    const backgrounds = [bg0, bg1, bg2];
    const currentBg = ref(0);
    let intervalId: ReturnType<typeof setInterval> | null = null;

    onMounted(async () => {
      intervalId = setInterval(() => {
        currentBg.value = (currentBg.value + 1) % backgrounds.length;
      }, 10000);

      const configuration = await loadConfiguration().catch(error => {
        console.error(error);
      });
      if (configuration) {
        i18n.global.locale.value = configuration.language as SUPPORTED_LANGUAGES;
      } else {
        i18n.global.locale.value = DEFAULT_LANGUAGE;
      }
      window.addEventListener('message', event => {
        if (event.data.channel === 'update-config') {
          i18n.global.locale.value = event.data.code;
        }
        if (event.data.channel === 'show-alert-modal') {
          modalTitle.value = event.data.alert.title;
          modalType.value = event.data.alert.type;
          modalMessage.value = event.data.alert.message;
          showLogButton.value = event.data.alert.showLogButton;
          isModalVisible.value = true;
        }
      });
    });

    onBeforeUnmount(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return {
      isModalVisible,
      modalType,
      modalMessage,
      modalTitle,
      showLogButton,
      backgrounds,
      currentBg,
    };
  },
});
</script>
