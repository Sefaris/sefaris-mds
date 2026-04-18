<template>
  <nav-bar />
  <main-section class="min-h-0 flex-1" />
  <footer-section />
  <confirm-modal
    :is-visible="showGamePathModal"
    type="warning"
    :title="'alert.gamePathInvalidTitle'"
    :message="$t('alert.gamePathInvalid')"
    confirm-label="alert.selectNewGameFolder"
    cancel-label="modal.close"
    @confirm="onConfirmSelectGameFolder"
    @cancel="showGamePathModal = false"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import NavBar from '../components/NavBar.vue';
import MainSection from '../components/MainSection.vue';
import FooterSection from '../components/FooterSection.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import {
  loadConfiguration,
  loadConfigurationRaw,
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

const INVALID_GAME_PATH_MESSAGE = getMessage('INVALID_GAME_PATH');

export default defineComponent({
  components: { NavBar, MainSection, FooterSection, ConfirmModal },
  setup() {
    const modsStore = useModsStore();
    const showGamePathModal = ref(false);
    const pendingRawConfig = ref<AppConfiguration | null>(null);

    async function bootstrap(loadedConfig: AppConfiguration | null | undefined) {
      modsStore.setConfigExists(true);
      await modsStore.reloadMods();
      await modsStore.loadInstalledMods();
      modsStore.loadCategories();
      await modsStore.loadPresets();

      if ((await getAlreadyInstalledFiles()).length && !loadedConfig?.filesCreated.length) {
        showAlert('modal.warning', translate('alert.foundAlreadyInstalledFiles'), 'warning');
      }

      if (!(await getAlreadyInstalledFiles()).length && loadedConfig?.filesCreated.length) {
        showAlert('modal.warning', translate('alert.modFilesNotFound'), 'warning');
        loadedConfig.filesCreated = [];
        loadedConfig.installedMods = [];
        await saveConfiguration(loadedConfig);
        await modsStore.loadInstalledMods();
      }
    }

    async function onConfirmSelectGameFolder() {
      const gamePath = await selectGameFolder();
      if (!gamePath) {
        // User cancelled — keep the modal open so they can retry without
        // losing the configuration.
        return;
      }
      const raw = pendingRawConfig.value;
      if (!raw) return;
      raw.gothicPath = gamePath;
      // Clear modsPath so `saveConfiguration` recomputes it via `path.join`
      // in the preload (avoids string concatenation in the renderer and
      // platform-specific separators).
      raw.modsPath = '';
      await saveConfiguration(raw);
      showGamePathModal.value = false;
      pendingRawConfig.value = null;
      const reloaded = await loadConfiguration().catch(error => {
        console.error(error);
        return null;
      });
      await bootstrap(reloaded);
    }

    onMounted(async () => {
      let config: AppConfiguration | null | undefined;
      let invalidGamePath = false;
      try {
        config = await loadConfiguration();
      } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === INVALID_GAME_PATH_MESSAGE) {
          invalidGamePath = true;
        }
      }

      if (invalidGamePath) {
        const raw = await loadConfigurationRaw().catch(err => {
          console.error(err);
          return null;
        });
        if (raw) {
          pendingRawConfig.value = raw;
          showGamePathModal.value = true;
          return;
        }
      }

      if (!config) {
        showAlert('modal.error', translate('alert.configNotFound'), 'error');
        loggerError(getMessage('CONFIG_NOT_FOUND'));
        const gamePath = await selectGameFolder();
        if (!gamePath) closeApplication();
        const fresh: AppConfiguration = {
          gothicPath: gamePath,
          language: DEFAULT_LANGUAGE,
          ignoreDependencies: false,
          ignoreIncompatible: false,
          installedMods: [],
          filesCreated: [],
        };
        await saveConfiguration(fresh);
        config = fresh;
      }

      await bootstrap(config);
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

    return { showGamePathModal, onConfirmSelectGameFolder };
  },
});
</script>
