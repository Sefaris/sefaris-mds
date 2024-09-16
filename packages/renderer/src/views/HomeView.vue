<template>
  <nav-bar />
  <main-section />
  <footer-section />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import NavBar from '../components/NavBar.vue';
import MainSection from '../components/MainSection.vue';
import FooterSection from '../components/FooterSection.vue';
import {
  loadConfiguration,
  selectGameFolder,
  closeApplication,
  saveConfiguration,
  loggerError,
} from '#preload';
import type { AppConfiguration } from '@interfaces/AppConfiguration';
import { DEFAULT_LANGUAGE } from '../../../../utils/constants';
import { translate } from '../../../../plugins/i18n';
import { useModsStore } from '../stores/mods-store';
import { getMessage } from '../../../../utils/messages';
import type { InstallationState } from '../../../../types/InstallationState';
export default defineComponent({
  components: { NavBar, MainSection, FooterSection },
  setup() {
    const modsStore = useModsStore();
    const installationState = computed({
      get() {
        return modsStore.installationState;
      },
      set(state: InstallationState) {
        modsStore.setInstallationState(state);
      },
    });
    onMounted(async () => {
      const config = await loadConfiguration();
      if (!config) {
        alert(`${translate('alert.configNotFound')}`);
        loggerError(getMessage('CONFIG_NOT_FOUND'));
        const gamePath = await selectGameFolder();
        if (!gamePath) closeApplication();
        const config: AppConfiguration = {
          gothicPath: gamePath,
          language: DEFAULT_LANGUAGE,
          ignoreDependencies: false,
          ignoreIncompatible: false,
          installedMods: [],
          filesCreated: [],
        };
        await saveConfiguration(config);
      }
      await modsStore.reloadMods();
      await modsStore.loadInstalledMods();
      modsStore.loadCategories();
      await modsStore.loadPresets();
      installationState.value = 'ready';
    });

    window.addEventListener('message', async event => {
      if (event.data.channel === 'reload-configuration') {
        await modsStore.reloadMods();
        await modsStore.loadInstalledMods();
        modsStore.loadCategories();
        await modsStore.loadPresets();
        installationState.value = 'ready';
        modsStore.incrementRefreshKey();
        modsStore.setSelectedMod('');
      }
    });

    return {};
  },
});
</script>
