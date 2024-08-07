<template>
  <div class="h-27 p-6 relative flex">
    <progress-bar :progress="progress" />
    <div class="flex justify-between items-center w-full">
      <div class="flex flex-col">
        <span>{{ stepName }}.</span>
        <span class="text-light">Nie wyłączaj launchera!</span>
      </div>
      <div>
        <span class="font-gothic text-primary text-5xl">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import ProgressBar from './ProgressBar.vue';
import { useModsStore } from '../stores/mods-store';
import type { ProgressStatus } from '@interfaces/ProgressStatus';
import type { InstallationState } from '../../../../types/InstallationState';
import { translate } from '../../../../plugins/i18n';

export default defineComponent({
  components: { ProgressBar },
  setup() {
    const progress = ref(0);
    const progressStyle = ref('0%');
    const modsStore = useModsStore();
    const stepName = ref('');

    const installationState = computed({
      get() {
        return modsStore.installationState;
      },
      set(state: InstallationState) {
        modsStore.setInstallationState(state);
      },
    });

    window.addEventListener('message', event => {
      const data = event.data as ProgressStatus;
      stepName.value = translate(data.actionName);
      progress.value = Number((((data.step + 1) / data.maxSteps) * 100).toFixed(0));
      progressStyle.value = `${progress.value}%`;
    });

    return { progress, installationState, stepName };
  },
});
</script>
