<template>
  <RouterLink to="/">Home</RouterLink>
  <h2>Config</h2>
  <div class="config-container">
    {{ configDetails }}

    <button @click="selectGameFolder">Select game folder</button>
    <button @click="save">Save</button>
    <button @click="load">Load</button>
  </div>
</template>

<script lang="ts">
import type {AppConfiguration} from '#preload';

import {defineComponent, ref} from 'vue';
import {selectGameFolder, isGothicPathValid, loadConfiguration, saveConfiguration} from '#preload';

export default defineComponent({
  components: {},
  setup() {
    const configDetails = ref<string>();
    let config: AppConfiguration = {
      gothicPath: '',
      modsPath: '',
      installedMods: [],
      filesCreated: [],
    };

    window.Apieriusz.onFolderSelected(async (folderPath: string) => {
      if (isGothicPathValid(folderPath)) {
        await load();
        config.gothicPath = folderPath;
      }
    });

    const save = async () => {
      await saveConfiguration(config);
      configDetails.value = JSON.stringify(config);
    };

    const load = async () => {
      const conf = await loadConfiguration();
      if (conf) {
        config = conf;
        configDetails.value = JSON.stringify(config);
      } else {
        console.error('Nie znaleziono pliku konfiguracyjnego');
      }
    };

    return {configDetails, selectGameFolder, config, save, load};
  },
});
</script>

<style lang="scss">
.config-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
h2 {
  text-align: center;
}
</style>
