<template>
  <div
    :key="refreshKey"
    class="flex h-126.5 justify-evenly pt-6"
  >
    <div class="flex w-91 flex-col overflow-y-auto">
      <div class="sticky top-0 flex justify-end gap-2 border-b border-divider bg-transparent px-4">
        <button-tooltip
          class="text-primary"
          icon="mdi-select-all"
          @click="selectAll"
        >
          {{ $t('main.mods.selectAll') }}
        </button-tooltip>
        <button-tooltip
          class="text-primary"
          icon="mdi-select-off"
          @click="deselectAll"
        >
          {{ $t('main.mods.deselectAll') }}
        </button-tooltip>
        <button-tooltip
          class="text-primary"
          icon="mdi-folder-home-outline"
          @click="openGameFolder"
        >
          {{ $t('main.mods.openGameFolder') }}
        </button-tooltip>
        <button-tooltip
          class="text-primary"
          icon="mdi-folder-table-outline"
          @click="openModsFolder"
        >
          {{ $t('main.mods.openModsFolder') }}
        </button-tooltip>
        <button-tooltip
          class="text-primary"
          icon="mdi-folder-cog-outline"
          @click="openStarterFolder"
        >
          {{ $t('main.mods.openStarterFolder') }}
        </button-tooltip>
        <button-tooltip
          class="text-primary"
          icon="mdi-folder-account-outline"
          @click="openDocumentsFolder"
        >
          {{ $t('main.mods.openDocumentsFolder') }}
        </button-tooltip>
      </div>
      <div class="flex w-91 flex-col overflow-y-auto">
        <no-mods v-if="!mods.length" />
        <mod-item
          v-for="(mod, index) in mods"
          :key="index"
          :config="config"
          :mod="mod"
        />
      </div>
    </div>
    <mod-preview />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, shallowRef, watch } from 'vue';
import ModPreview from './ModPreview.vue';
import { useModsStore } from '../stores/mods-store';
import NoMods from './NoMods.vue';
import ModItem from './ModItem.vue';
import ButtonTooltip from './ButtonTooltip.vue';
import {
  openModsFolder,
  openGameFolder,
  loadConfiguration,
  openStarterFolder,
  openDocumentsFolder,
} from '#preload';
import type { AppConfiguration } from '../../../../interfaces/AppConfiguration';
export default defineComponent({
  components: { ModPreview, NoMods, ModItem, ButtonTooltip },
  setup() {
    const modsStore = useModsStore();
    const mods = computed(() => modsStore.displayedMods);
    const refreshKey = computed(() => modsStore.refreshKey);
    const config = shallowRef<AppConfiguration | null>(null);
    const selectedMods = computed({
      get() {
        return modsStore.selectedMods;
      },
      set(mods) {
        modsStore.setSelectedMods(mods);
      },
    });

    const selectAll = () => {
      selectedMods.value = mods.value.map(mod => mod.id);
    };

    const deselectAll = () => {
      selectedMods.value = [];
    };

    watch(refreshKey, async () => {
      config.value = await loadConfiguration();
    });

    onMounted(async () => {
      config.value = await loadConfiguration();
    });

    return {
      mods,
      refreshKey,
      config,
      openModsFolder,
      openGameFolder,
      openStarterFolder,
      openDocumentsFolder,
      selectAll,
      deselectAll,
    };
  },
});
</script>
