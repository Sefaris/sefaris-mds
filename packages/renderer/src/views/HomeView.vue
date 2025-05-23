<template>
  <nav-bar />
  <main-section />
  <footer-section />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import NavBar from '../components/NavBar.vue';
import MainSection from '../components/MainSection.vue';
import FooterSection from '../components/FooterSection.vue';
import {
  loadConfiguration,
  selectGameFolder,
  closeApplication,
  saveConfiguration,
  loggerError,
  showAlert,
  getAlreadyInstalledFiles,
} from '#preload';
import type { AppConfiguration } from '@interfaces/AppConfiguration';
import { DEFAULT_LANGUAGE } from '../../../../utils/constants';
import { useModsStore } from '../stores/mods-store';
import { getMessage } from '../../../../utils/messages';
import { translate } from '../../../../plugins/i18n';
export default defineComponent({
  components: { NavBar, MainSection, FooterSection },
  setup() {
    const modsStore = useModsStore();

    onMounted(async () => {
      const config = await loadConfiguration().catch(error => {
        console.error(error);
      });
      if (!config) {
        showAlert('modal.error', translate('alert.configNotFound'), 'error');
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
      modsStore.setConfigExists(true);
      await modsStore.reloadMods();
      await modsStore.loadInstalledMods();
      modsStore.loadCategories();
      await modsStore.loadPresets();

      if ((await getAlreadyInstalledFiles()).length && !config?.filesCreated.length) {
        showAlert('modal.warning', translate('alert.foundAlreadyInstalledFiles'), 'warning');
      }

      if (!(await getAlreadyInstalledFiles()).length && config?.filesCreated.length) {
        showAlert('modal.warning', translate('alert.modFilesNotFound'), 'warning');
        config.filesCreated = [];
        config.installedMods = [];
        await saveConfiguration(config);
        await modsStore.loadInstalledMods();
      }
    });

    window.addEventListener('message', async event => {
      if (event.data.channel === 'reload-configuration') {
        await modsStore.reloadMods();
        await modsStore.loadInstalledMods();
        modsStore.loadCategories();
        await modsStore.loadPresets();
        modsStore.incrementRefreshKey();
        modsStore.setSelectedMod('');
        modsStore.setConfigExists(true);
      }
    });

    return {};
  },
});
</script>
