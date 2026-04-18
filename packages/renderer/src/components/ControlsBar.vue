<template>
  <div class="flex items-center justify-between select-none">
    <div class="p-6">
      <img src="../../assets/images/game-icon.png" />
    </div>
    <ready-button v-if="installationState === 'ready'" />
    <installation-buttons v-else-if="installationState === 'edit'" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from 'vue';
import { useModsStore } from '../stores/mods-store';
import ReadyButton from './ReadyButton.vue';
import InstallationButtons from './InstallationButtons.vue';
import type { InstallationState } from '../../../../types/InstallationState';
import { equalModIdSets } from '../../../../utils/mod-id';
export default defineComponent({
  components: { ReadyButton, InstallationButtons },
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

    watchEffect(() => {
      const modsMatch = equalModIdSets(
        modsStore.selectedMods,
        modsStore.installedMods.map(mod => mod.id),
      );
      const currentPreset = modsStore.activePreset || modsStore.basePreset;
      const presetMatch = currentPreset === modsStore.installedPreset;

      modsStore.setInstallationState(modsMatch && presetMatch ? 'ready' : 'edit');
    });

    return {
      installationState,
    };
  },
});
</script>
