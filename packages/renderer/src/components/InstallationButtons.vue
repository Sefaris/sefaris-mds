<template>
  <div class="flex h-15 items-center gap-3">
    <button
      class="h-8.5"
      @click="cancelChanges()"
    >
      {{ $t('action.cancel') }}
    </button>
    <button
      class="mr-6 h-15 w-78.75 bg-install"
      @click="startInstallation()"
    >
      <span class="font-gothic text-3xl">{{ $t('action.install') }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import { installMods, loggerError, loggerInfo } from '#preload';
import { computed, defineComponent } from 'vue';
import { useModsStore } from '../stores/mods-store';
import { translate } from '../../../../plugins/i18n';
import type { InstallationState } from '../../../../types/InstallationState';
import { getMessage } from '../../../../utils/messages';

export default defineComponent({
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
          alert(`${translate('alert.installed')} ${time}s`);
          loggerInfo(`${getMessage('MODS_INSTALLED')} ${time}s`);
          installedMods.value = modsStore.mods.filter(mod => selectedMods.value.includes(mod.id));
          installationState.value = 'ready';
        })
        .catch(error => {
          installedMods.value = [];
          installationState.value = 'edit';
          console.error(error);
          loggerError(error);
        });
    };
    const cancelChanges = () => {
      selectedMods.value = modsStore.installedMods.map(mod => mod.id);
    };

    return { startInstallation, cancelChanges };
  },
});
</script>
