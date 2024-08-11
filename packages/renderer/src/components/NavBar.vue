<template>
  <div class="box-border flex h-28.5 flex-col border-b border-divider">
    <div class="m-6 flex h-8 justify-between">
      <span
        class="cursor-pointer text-xl text-primary hover:text-primary-hover"
        @click="openWebsite(SEFARIS_WEBSITE)"
      >
        Sefaris.eu
      </span>

      <div class="flex gap-3">
        <change-locale />
        <nav-item title="options" />
        <kofi-button />
      </div>
    </div>

    <div class="flex items-center justify-center">
      <span class="mr-6 text-light"> {{ $t('nav.bottom.title') }}: </span>
      <div class="flex h-8.5 items-center gap-6">
        <category-button
          :active="activeCategory === 'all'"
          :mods-counter="modsCounter"
          category="all"
        />
        <category-button
          :active="activeCategory === 'installed'"
          :mods-counter="installedModsCounter"
          :disabled="installedModsCounter === 0"
          category="installed"
        />
        <categories-dropdown v-if="categoriesExist" />
        <presets-dropdown v-if="presetsExist" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { openWebsite } from '#preload';
import ChangeLocale from './ChangeLocale.vue';
import KofiButton from './KofiButton.vue';
import CategoriesDropdown from './CategoriesDropdown.vue';
import PresetsDropdown from './PresetsDropdown.vue';
import { useModsStore } from '../stores/mods-store';
import { SEFARIS_WEBSITE } from '../../../../utils/constants';
import CategoryButton from './CategoryButton.vue';
import NavItem from './NavItem.vue';
export default defineComponent({
  components: {
    ChangeLocale,
    KofiButton,
    CategoriesDropdown,
    PresetsDropdown,
    CategoryButton,
    NavItem,
  },
  setup() {
    const activeCategory = computed(() => modsStore.activeCategory);
    const modsStore = useModsStore();
    const modsCounter = computed(() => modsStore.mods.length);
    const installedModsCounter = computed(() => modsStore.installedMods.length);
    const categoriesExist = computed(() => modsStore.categories.length > 0);
    const presetsExist = computed(() => modsStore.presets.length > 0);

    const selectCategory = (category: string) => {
      modsStore.displayCategory(category);
    };

    return {
      openWebsite,
      modsCounter,
      activeCategory,
      installedModsCounter,
      categoriesExist,
      selectCategory,
      presetsExist,
      SEFARIS_WEBSITE,
    };
  },
});
</script>
