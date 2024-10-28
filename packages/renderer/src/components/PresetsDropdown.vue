<template>
  <app-dropdown btn-class="nav-bottom-links-container-tab">
    <template #activator>{{ $t('nav.bottom.presets') }}</template>
    <div class="nav-bottom-links-container-tab-items">
      <button
        v-for="(preset, index) in presets"
        :key="index"
        class="nav-bottom-links-container-tab-items-item"
        :class="{
          'nav-bottom-links-container-tab-items-item-active': preset.name === activePreset,
        }"
        @click="selectPreset(preset.name)"
      >
        {{ preset.name }} ({{ preset.modIds.length }})
      </button>
    </div>
  </app-dropdown>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import AppDropdown from './AppDropdown.vue';
import { useModsStore } from '../stores/mods-store';

export default defineComponent({
  components: { AppDropdown },
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
