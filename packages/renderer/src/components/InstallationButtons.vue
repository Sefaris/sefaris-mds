<template>
  <div class="flex h-15 items-center gap-3">
    <button
      class="h-8.5"
      @click="cancelChanges()"
    >
      {{ $t('action.cancel') }}
    </button>
    <button
      v-if="selectedMods.length"
      class="mr-6 h-15 w-78.75 bg-install"
      @click="startInstallation()"
    >
      <span
        class="font-gothic text-3xl"
        :class="{ 'font-lato': currentLanguage == 'ru' }"
      >
        {{ $t('action.install') }}
      </span>
    </button>
    <button
      v-else
      class="mr-6 h-15 w-78.75 bg-install"
      @click="startDeletion()"
    >
      <span
        class="font-gothic text-3xl"
        :class="{ 'font-lato': currentLanguage == 'ru' }"
      >
        {{ $t('action.delete') }}
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import {
  deleteMods,
  installMods,
  loggerError,
  loggerInfo,
  showAlert,
  showNotification,
} from '#preload';
import { computed, defineComponent } from 'vue';
import { useModsStore } from '../stores/mods-store';
import { translate, i18n } from '../../../../plugins/i18n';
import type { InstallationState } from '../../../../types/InstallationState';
import { getMessage } from '../../../../utils/messages';

export default defineComponent({
  setup() {
    const modsStore = useModsStore();
    const currentLanguage = computed(() => i18n.global.locale.value);
    const installationState = computed({
      get() {
        return modsStore.installationState;
      },
      set(state: InstallationState) {
        modsStore.setInstallationState(state);
      },
    });
    const activePreset = computed(() => modsStore.activePreset);
    const selectedMods = computed({
      get() {
        return modsStore.selectedMods;
      },
      set(mods) {
        modsStore.setSelectedMods(mods);
      },
    });
    const installedMods = computed({
      get() {
        return modsStore.installedMods;
      },
      set(mods) {
        modsStore.setInstalledMods(mods);
      },
    });
    const startInstallation = async () => {
      installationState.value = 'installation';
      installMods(JSON.parse(JSON.stringify(selectedMods.value)), activePreset.value)
        .then(time => {
          showAlert('modal.info', `${translate('alert.installed')} ${time}s`, 'info');
          showNotification({
            title: translate('modal.info'),
            body: `${translate('alert.installed')} ${time}s`,
          });
          loggerInfo(`${getMessage('MODS_INSTALLED')} ${time}s`);
          installedMods.value = modsStore.mods.filter(mod => selectedMods.value.includes(mod.id));
          installationState.value = 'ready';
        })
        .catch(error => {
          installationState.value = 'edit';
          loggerError(error);
        });
    };

    const startDeletion = async () => {
      deleteMods()
        .then(() => {
          showAlert('modal.info', translate('alert.deleted'), 'info');
          loggerInfo(getMessage('MODS_DELETED'));
          installedMods.value = modsStore.mods.filter(mod => selectedMods.value.includes(mod.id));
          installationState.value = 'ready';
        })
        .catch(error => {
          installationState.value = 'edit';
          loggerError(error);
        });
    };
    const cancelChanges = () => {
      selectedMods.value = modsStore.installedMods.map(mod => mod.id);
    };

    return { startInstallation, cancelChanges, startDeletion, selectedMods, currentLanguage };
  },
});
</script>
