<template>
  <div class="flex flex-col">
    <no-mods v-if="!hasAnyMods" />

    <template v-else>
      <div
        v-for="(modsInCategory, category) in grouped"
        :key="category"
        class="flex flex-col"
      >
        <button
          type="button"
          class="border-divider hover:bg-divider/30 flex h-9 cursor-pointer items-center justify-between border-b px-4 text-left select-none"
          :aria-expanded="isExpanded(category)"
          @click="toggleCategory(category)"
        >
          <span class="flex items-center gap-2">
            <i
              class="mdi"
              :class="isExpanded(category) ? 'mdi-chevron-down' : 'mdi-chevron-right'"
            />
            <span>{{ category }}</span>
          </span>
          <span class="text-light text-sm">({{ modsInCategory.length }})</span>
        </button>

        <div
          v-if="isExpanded(category)"
          class="flex flex-col"
        >
          <mod-item
            v-for="mod in modsInCategory"
            :key="mod.id"
            :config="config"
            :mod="mod"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { useModsStore } from '../stores/mods-store';
import ModItem from './ModItem.vue';
import NoMods from './NoMods.vue';
import type { AppConfiguration } from '../../../../interfaces/AppConfiguration';

export default defineComponent({
  components: { ModItem, NoMods },
  props: {
    config: {
      type: Object as PropType<AppConfiguration | null>,
      required: true,
    },
  },
  setup() {
    const modsStore = useModsStore();
    const grouped = computed(() => modsStore.groupedMods);
    const hasAnyMods = computed(() => Object.values(grouped.value).some(list => list.length > 0));

    const isExpanded = (category: string) => modsStore.isCategoryExpanded(category);
    const toggleCategory = (category: string) => modsStore.toggleCategoryExpanded(category);

    return {
      grouped,
      hasAnyMods,
      isExpanded,
      toggleCategory,
    };
  },
});
</script>
