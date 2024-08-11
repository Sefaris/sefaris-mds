<template>
  <div class="h-27 shadow-[inset_0_1px_0_0_#30303b]">
    <installation-bar v-if="installationState === 'installation'" />
    <controls-bar v-else />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import ControlsBar from './ControlsBar.vue';
import InstallationBar from './InstallationBar.vue';
import { useModsStore } from '../stores/mods-store';
export default defineComponent({
  components: { ControlsBar, InstallationBar },
  setup() {
    const modsStore = useModsStore();
    const installationState = computed(() => modsStore.installationState);

    return {
      installationState,
    };
  },
});
</script>
