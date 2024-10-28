<template>
  <div class="flex select-none items-center justify-between">
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

    function compareArrays(arr1: string[], arr2: string[]): boolean {
      if (arr1.length !== arr2.length) {
        return false;
      }

      const sortedArr1 = [...arr1].sort();
      const sortedArr2 = [...arr2].sort();
      for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
          return false;
        }
      }

      return true;
    }

    watchEffect(() => {
      modsStore.setInstallationState(
        compareArrays(
          modsStore.selectedMods,
          modsStore.installedMods.map(mod => mod.id),
        )
          ? 'ready'
          : 'edit',
      );
    });

    return {
      installationState,
    };
  },
});
</script>
