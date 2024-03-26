<template>
  <div class="config-container">
    <h2>{{ $t('common.configuration') }}</h2>
    <div class="config">
      <input
        :value="config.gothicPath"
        class="config-input"
        type="text"
      />
      <custom-button
        tooltip="Select Game folder"
        :action="selectG3Folder"
        icon="mdi-folder"
        :disabled="selectingGothicFolder"
      />
    </div>
    <button
      v-for="(lang, index) in LANGUAGE_SETTINGS"
      :key="index"
      href="#"
      class="dropdown-container-content-row cursor-pointer"
      @click.prevent="changeLanguage(lang.code)"
    >
      <span :class="'fi fi-' + lang.code" />

      <span>{{ lang.text }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import type { AppConfiguration } from '#preload';

import { computed, defineComponent, ref, watch } from 'vue';
import { selectGameFolder, isGothicPathValid, saveConfiguration, loadConfiguration } from '#preload';
import CustomButton from '../components/CustomButton.vue';
import type { SUPPORTED_LANGUAGES } from './../plugins/i18n';
import { i18n, DEFAULT_LANGUAGE, LANGUAGE_SETTINGS } from './../plugins/i18n';

export default defineComponent({
  components: {
    CustomButton,
  },
  setup() {
    const config = ref<AppConfiguration>({
      gothicPath: '',
      modsPath: '',
      language: 'gb',
      installedMods: [],
      filesCreated: [],
    });
    const selectingGothicFolder = ref(false);
    checkConfig();

    async function selectG3Folder() {
      selectingGothicFolder.value = true;
      while (selectingGothicFolder.value) {
        const folderPath = await selectGameFolder();
        if (!folderPath) {
          selectingGothicFolder.value = false;
          break;
        }
        if (!isGothicPathValid(folderPath)) {
          alert('Invalid Gothic path');
          continue;
        }
        config.value.gothicPath = folderPath;
        await saveConfig();
        selectingGothicFolder.value = false;
      }
    }

    async function checkConfig() {
      const conf = await loadConfiguration();
      if (conf) {
        config.value = conf;
      }
    }


    async function saveConfig() {
      const configCopy = JSON.parse(JSON.stringify(config.value));
      if (await saveConfiguration(configCopy)) {
        //something
      } else {
        alert('Error saving configuration');
      }
    }


    const currentLanguageCode = ref(DEFAULT_LANGUAGE);
    const currentLanguage = computed(() => LANGUAGE_SETTINGS.find(entry => entry.code === currentLanguageCode.value));

    function changeLanguage(code: string) {
      if (currentLanguageCode.value === code) {
        return;
      }
      currentLanguageCode.value = code;
      config.value.language = code;
      saveConfig();
    }

    watch(
      () => currentLanguageCode.value,
      () => {
        i18n.global.locale.value = currentLanguageCode.value as SUPPORTED_LANGUAGES;
      },
    );

    return { config, selectingGothicFolder, selectG3Folder, changeLanguage, currentLanguage, LANGUAGE_SETTINGS };
  },
});
</script>

<style lang="scss">
.config-container {
  height: calc(100vh - 60px);
}

.config {
  display: flex;
  justify-content: center;
}

h2 {
  text-align: center;
}


.config-input {
  width: 500px;
  padding: 0.25rem;
}
</style>
