<template>
  <app-dropdown>
    <template #activator>{{ $t('nav.bottom.presets') }}</template>
    <div class="max-h-110 min-w-50 overflow-y-auto">
      <div class="mr-2 flex flex-col gap-1">
        <preset-dropdown-button
          v-for="(preset, index) in presets"
          :key="index"
          :preset="preset.name"
          :active="preset.name === activePreset"
          :mods-count="preset.modIds.length"
        />
        <button
          class="h-8.5 w-full rounded-md px-4 py-1.5 text-primary hover:bg-default-hover"
          @click="showPresetModal"
        >
          <i class="mdi mdi-plus mdi-small"> </i>
        </button>
      </div>
    </div>
  </app-dropdown>
  <preset-modal
    :is-visible="showModal"
    @close="hidePresetModal"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

import AppDropdown from './AppDropdown.vue';
import { useModsStore } from '../stores/mods-store';
import PresetDropdownButton from './PresetDropdownButton.vue';
import PresetModal from './PresetModal.vue';

export default defineComponent({
  components: { AppDropdown, PresetDropdownButton, PresetModal },
  setup() {
    const modsStore = useModsStore();
    const presets = computed(() => modsStore.presets);
    const activePreset = computed(() => modsStore.activePreset);
    const showModal = ref(false);

    const selectPreset = (preset: string) => {
      modsStore.selectPreset(preset);
    };

    const showPresetModal = () => {
      showModal.value = true;
    };

    const hidePresetModal = () => {
      showModal.value = false;
    };

    return {
      presets,
      selectPreset,
      activePreset,
      showModal,
      showPresetModal,
      hidePresetModal,
    };
  },
});
</script>
