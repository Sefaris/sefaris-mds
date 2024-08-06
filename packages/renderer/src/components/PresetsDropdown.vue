<template>
  <app-dropdown>
    <template #activator>{{ $t('nav.bottom.presets') }}</template>
    <div class="overflow-y-auto max-h-110">
      <div class="flex flex-col mr-2 gap-1">
        <preset-dropdown-button
          v-for="(preset, index) in presets"
          :key="index"
          :preset="preset.name"
          :active="preset.name === activePreset"
          :mods-count="preset.modIds.length"
        />
      </div>
    </div>
  </app-dropdown>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import AppDropdown from './AppDropdown.vue';
import { useModsStore } from '../stores/mods-store';
import PresetDropdownButton from './PresetDropdownButton.vue';

export default defineComponent({
  components: { AppDropdown, PresetDropdownButton },
  setup() {
    const modsStore = useModsStore();
    const presets = computed(() => modsStore.presets);
    const activePreset = computed(() => modsStore.activePreset);

    const selectPreset = (preset: string) => {
      modsStore.selectPreset(preset);
    };

    return {
      presets,
      selectPreset,
      activePreset,
    };
  },
});
</script>
