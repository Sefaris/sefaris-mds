<template>
  <div
    ref="containerRef"
    :key="refreshKey"
    class="flex min-h-0 flex-1 px-6 pt-6"
  >
    <div
      data-panel="left"
      class="flex shrink-0 flex-col overflow-y-auto"
      style="width: 364px"
    >
      <div
        class="sticky top-0 flex h-9 justify-end gap-2 border-b border-divider bg-transparent px-4"
      >
        <template v-if="displaySearchBar">
          <div class="flex w-full flex-row items-center justify-between gap-2">
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
      <div class="flex flex-col overflow-y-auto">
        <no-mods v-if="!mods.length" />
        <mod-item
          v-for="(mod, index) in mods"
          :key="index"
          :config="config"
          :mod="mod"
        />
      </div>
    </div>

    <div
      class="flex w-1.5 shrink-0 cursor-col-resize items-center justify-center hover:bg-divider/40 active:bg-divider/60"
      @mousedown="startResize"
      @dblclick="resetPanelWidth"
    >
      <div class="h-8 w-0.5 rounded-full bg-divider" />
    </div>

    <mod-preview />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
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

const MIN_LEFT_WIDTH = 364;
const MIN_RIGHT_WIDTH = 364;

export default defineComponent({
  components: { AppInput, ModPreview, NoMods, ModItem, ButtonTooltip },

  setup() {
    const queryInputRef = ref<InstanceType<typeof AppInput>>();
    const displaySearchBar = ref(false);
    const containerRef = ref<HTMLElement | null>(null);
    let leftPanelEl: HTMLElement | null = null;
    let isResizing = false;
    let rafId = 0;
    let currentWidth = MIN_LEFT_WIDTH;

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.value) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (!containerRef.value || !leftPanelEl) return;
        const containerRect = containerRef.value.getBoundingClientRect();
        const paddingLeft = 24;
        const handleWidth = 6;
        const newWidth = e.clientX - containerRect.left - paddingLeft;
        const maxWidth = containerRect.width - paddingLeft * 2 - handleWidth - MIN_RIGHT_WIDTH;
        currentWidth = Math.max(MIN_LEFT_WIDTH, Math.min(newWidth, maxWidth));
        leftPanelEl.style.width = currentWidth + 'px';
      });
    };

    const onMouseUp = () => {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const startResize = () => {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };

    const resetPanelWidth = () => {
      currentWidth = MIN_LEFT_WIDTH;
      if (leftPanelEl) leftPanelEl.style.width = MIN_LEFT_WIDTH + 'px';
    };

    const clampWidth = () => {
      if (!containerRef.value || !leftPanelEl) return;
      const containerRect = containerRef.value.getBoundingClientRect();
      const paddingLeft = 24;
      const handleWidth = 6;
      const maxWidth = containerRect.width - paddingLeft * 2 - handleWidth - MIN_RIGHT_WIDTH;
      if (currentWidth > maxWidth) {
        currentWidth = Math.max(MIN_LEFT_WIDTH, maxWidth);
        leftPanelEl.style.width = currentWidth + 'px';
      }
    };

    onMounted(() => {
      leftPanelEl = containerRef.value?.querySelector('[data-panel="left"]') as HTMLElement;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      window.addEventListener('resize', clampWidth);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', clampWidth);
    });
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
      containerRef,
      mods,
      refreshKey,
      config,
      displaySearchBar,
      startResize,
      resetPanelWidth,

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
