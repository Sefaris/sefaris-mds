<template>
  <app-dropdown>
    <template #activator>{{ $t('nav.bottom.presets') }}</template>
    <div class="max-h-110 overflow-y-auto">
      <div class="mr-2 flex flex-col gap-1">
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
