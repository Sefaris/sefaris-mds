<template>
  <app-dropdown>
    <template #activator>{{ $t('nav.bottom.categories') }}</template>
    <div class="overflow-y-auto max-h-110">
      <div class="flex flex-col mr-2 gap-1">
        <category-dropdown-button
          v-for="(category, index) in categories"
          :key="index"
          :category="category"
          :active="category === activeCategory"
          :mods-count="countModsInCategory(category)"
        />
      </div>
    </div>
  </app-dropdown>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import AppDropdown from './AppDropdown.vue';
import { useModsStore } from '../stores/mods-store';
import CategoryDropdownButton from './CategoryDropdownButton.vue';

export default defineComponent({
  components: { AppDropdown, CategoryDropdownButton },
  setup() {
    const modsStore = useModsStore();
    const categories = computed(() => modsStore.categories);
    const activeCategory = computed(() => modsStore.activeCategory);

    const countModsInCategory = (category: string) => {
      return modsStore.countModsInCategory(category);
    };
    const selectCategory = (category: string) => {
      modsStore.displayCategory(category);
    };

    return {
      categories,
      selectCategory,
      activeCategory,
      countModsInCategory,
    };
  },
});
</script>
