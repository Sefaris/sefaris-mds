<template>
  <div class="config-container">
    <h2>{{ $t('common.configuration') }}</h2>
    <div class="config">
      <input
        :value="config.gothicPath"
        class="config-input"
        type="text"
        @input="handleInputChange"
      />
      <span v-if="configDetails">{{ configDetails }}</span>
      <span v-if="error">{{ error }}</span>

      <button @click="selectG3Folder">Select game folder</button>
      <button
        :disabled="!config.gothicPath || !!error"
        @click="saveConfig"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import type { AppConfiguration } from '#preload';

import { defineComponent, ref } from 'vue';
import { selectGameFolder, isGothicPathValid, saveConfiguration, loadConfiguration } from '#preload';
import router from '../router';

export default defineComponent({
  components: {},
  setup() {
    const configDetails = ref<string>();
    const config = ref<AppConfiguration>({
      gothicPath: '',
      modsPath: '',
      installedMods: [],
      filesCreated: [],
    });
    const error = ref<string>();

    async function selectG3Folder() {
      error.value = '';

      const folderPath = await selectGameFolder();
      if (!folderPath) {
        error.value = 'No folder selected';
        return;
      }
      if (!isGothicPathValid(folderPath)) {
        error.value = 'Invalid Gothic path';
        return;
      }
      config.value.gothicPath = folderPath;
    }

    function handleInputChange(event: Event) {
      configDetails.value = '';
      error.value = '';
      const inputElement = event.target as HTMLInputElement;
      config.value.gothicPath = inputElement.value;
      if (!isGothicPathValid(inputElement.value)) {
        error.value = 'Invalid Gothic path';
      }
    }
    async function checkConfig() {
      const conf = await loadConfiguration();
      if (conf) {
        config.value = conf;
      }
    }
    checkConfig();

    async function saveConfig() {
      const configCopy = JSON.parse(JSON.stringify(config.value));
      if (await saveConfiguration(configCopy)) {
        //TODO: Replace with toast
        alert('Configuration saved!');
        router.push('/');
      } else {
        //TODO: Replace with toast
        configDetails.value = 'Configuration save failed';
      }
    }

    return { configDetails, config, error, selectG3Folder, handleInputChange, saveConfig };
  },
});
</script>

<style lang="scss">
.config-container {
  height: calc(100vh - 60px);
}

.config {
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    padding: 0.25rem;
    margin: 0.25rem;
  }
}

h2 {
  text-align: center;
}

.config-input {
  width: 500px;
  padding: 0.25rem;
}
</style>
