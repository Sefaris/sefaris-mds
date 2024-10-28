<template>
  <title-bar />
  <router-view />
  <alert-modal
    :is-visible="isModalVisible"
    :type="modalType"
    :title="modalTitle"
    :message="modalMessage"
    @close="isModalVisible = false"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import TitleBar from './components/TitleBar.vue';
import { i18n } from '../../../plugins/i18n';
import { loadConfiguration } from '#preload';
import type { SUPPORTED_LANGUAGES } from '../../../utils/constants';
import { DEFAULT_LANGUAGE } from '../../../utils/constants';
import AlertModal from './components/AlertModal.vue';
export default defineComponent({
  components: { TitleBar, AlertModal },
  setup() {
    const isModalVisible = ref(false);
    const modalType = ref<string>();
    const modalTitle = ref('');
    const modalMessage = ref('');
    onMounted(async () => {
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
          isModalVisible.value = true;
        }
      });
    });
    return {
      isModalVisible,
      modalType,
      modalMessage,
      modalTitle,
    };
  },
});
</script>
