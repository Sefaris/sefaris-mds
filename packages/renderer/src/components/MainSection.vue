<template>
  <div
    :key="refreshKey"
    class="flex h-126.5 justify-evenly pt-6"
  >
    <div class="flex w-91 flex-col overflow-y-auto">
      <no-mods v-if="!mods.length" />
      <mod-item
        v-for="(mod, index) in mods"
        :key="index"
        :mod="mod"
      />
    </div>
    <mod-preview />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import ModPreview from './ModPreview.vue';
import { useModsStore } from '../stores/mods-store';
import NoMods from './NoMods.vue';
import ModItem from './ModItem.vue';
export default defineComponent({
  components: { ModPreview, NoMods, ModItem },
  setup() {
    const modsStore = useModsStore();
    const mods = computed(() => modsStore.displayedMods);
    const refreshKey = computed(() => modsStore.refreshKey);

    return {
      mods,
      refreshKey,
    };

  },
});
</script>
