<template>
  <div>
    <app-dropdown btn-class="nav-bottom-links-container-tab">
      <template #activator>{{ $t('nav.bottom.categories') }}</template>
      <div class="nav-bottom-links-container-tab-items">
        <button
          v-for="(category, index) in categories"
          :key="index"
          class="nav-bottom-links-container-tab-items-item"
          :class="{
            'nav-bottom-links-container-tab-items-item-active': category === activeCategory,
          }"
          @click="selectCategory(category)"
        >
          {{ category }} ({{ countModsInCategory(category) }})
        </button>
      </div>
    </app-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import AppDropdown from './AppDropdown.vue';
import { useModsStore } from '../stores/mods-store';

export default defineComponent({
  components: { AppDropdown },
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
