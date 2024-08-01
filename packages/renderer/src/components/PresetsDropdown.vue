<template>
  <div>
    <dropdown btn-class="nav-bottom-links-container-tab">
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
    </dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import Dropdown from './Dropdown.vue';
import { useModsStore } from '../stores/mods-store';

export default defineComponent({
  components: { Dropdown },
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
