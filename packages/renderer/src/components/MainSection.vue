<template>
  <div
    :key="refreshKey"
    class="flex h-126.5 justify-evenly pt-6"
  >
    <div class="flex w-91 flex-col overflow-y-auto">
      <div
        class="sticky top-0 flex h-9 justify-end gap-2 border-b border-divider bg-transparent px-4"
      >
        <template v-if="displaySearchBar">
          <div class="flex w-100 flex-row items-center justify-between gap-2">
            <app-input
              ref="queryInputRef"
              v-model="query"
              class="flex-grow"
              :maxlength="100"
              :placeholder="$t('main.mods.searchPlaceholder')"
            />

            <button-tooltip
              class="text-primary"
              icon="mdi-close"
              @click="stopSearch"
            >
              {{ $t('modal.close') }}
            </button-tooltip>
          </div>
        </template>

        <template v-else>
          <button-tooltip
            class="text-primary"
            icon="mdi-magnify"
            @click="startSearch"
          >
            {{ $t('main.mods.search') }}
          </button-tooltip>

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
        </template>
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
import { computed, defineComponent, nextTick, onMounted, ref, shallowRef, watch } from 'vue';
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
import AppInput from './Forms/AppInput.vue';

export default defineComponent({
  components: { AppInput, ModPreview, NoMods, ModItem, ButtonTooltip },

  setup() {
    const queryInputRef = ref<InstanceType<typeof AppInput>>();
    const displaySearchBar = ref(false);
    const modsStore = useModsStore();
    const query = computed({
      set: modsStore.setQuery,
      get: modsStore.getQuery,
    });
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

    const startSearch = () => {
      displaySearchBar.value = true;
      window.addEventListener('keydown', onQueryKeyDown);

      nextTick(() => queryInputRef.value?.inputRef?.focus());
    };

    const stopSearch = () => {
      displaySearchBar.value = false;
      modsStore.clearQuery();
      window.removeEventListener('keydown', onQueryKeyDown);
    };

    const onQueryKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        stopSearch();
      }
    };

    watch(refreshKey, async () => {
      config.value = await loadConfiguration();
    });

    onMounted(async () => {
      config.value = await loadConfiguration();
    });

    return {
      query,
      queryInputRef,
      mods,
      refreshKey,
      config,
      displaySearchBar,

      openModsFolder,
      openGameFolder,
      openStarterFolder,
      openDocumentsFolder,
      selectAll,
      deselectAll,
      startSearch,
      stopSearch,
    };
  },
});
</script>
