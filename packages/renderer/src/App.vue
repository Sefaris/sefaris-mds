<template>
  <title-bar />
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import TitleBar from './components/TitleBar.vue';
import { useModsStore } from './stores/mods-store';
import { closeApplication, loadConfiguration, saveConfiguration, selectGameFolder } from '#preload';
import { translate } from '../../../plugins/i18n';
import { DEFAULT_LANGUAGE } from '../../../utils/constants';
import type { AppConfiguration } from '../../../interfaces/AppConfiguration';
export default defineComponent({
  components: { TitleBar },
  setup() {
    const modsStore = useModsStore();
    onMounted(async () => {
      const config = await loadConfiguration();
      if (!config) {
        alert(`${translate('alert.configNotFound')}`);
        const gamePath = await selectGameFolder();
        if (!gamePath) closeApplication();
        const config: AppConfiguration = {
          gothicPath: gamePath,
          language: DEFAULT_LANGUAGE,
          installedMods: [],
          filesCreated: [],
        };
        await saveConfiguration(config);
      }
      await modsStore.reloadMods();
      await modsStore.loadInstalledMods();
      await modsStore.loadCategories();
      await modsStore.loadPresets();
    });

    return {};
  },
});
</script>
