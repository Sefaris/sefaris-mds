<template>
  <RouterLink to="/">Home</RouterLink>
  <h2>Config</h2>
  <div class="config-container">
    {{ path }}

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
    const path = ref<string>();
    let config: AppConfiguration = {
      gothicPath: '',
      installedMods: [],
      filesCreated: [],
    };

    //TODO: TS nie widzi Apieriusza
    window.Apieriusz.onFolderSelected((folderPath: string) => {
      if (isGothicPathValid(folderPath)) {
        path.value = folderPath;
        config.gothicPath = folderPath;
      }
    });

    const save = async () => {
      await saveConfiguration(config);
    };

    const load = async () => {
      const conf = await loadConfiguration();
      if (conf) {
        config = conf;
        path.value = config.gothicPath;
      } else {
        console.error('Nie znaleziono pliku konfiguracyjnego');
      }
    };

    return {path, selectGameFolder, config, save, load};
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
