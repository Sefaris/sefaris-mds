<template>
  <div
    class="mr-2 flex items-center gap-3 py-1.5"
    :class="{ 'border-r-4 border-primary': isActive }"
  >
    <mod-checkbox :mod-id="mod.id" />
    <span
      class="cursor-pointer"
      @click="selectedMod = mod.id"
    >
      {{ mod.id }}
    </span>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { useModsStore } from '../stores/mods-store';
import type { Mod } from '@interfaces/Mod';
import ModCheckbox from './ModCheckbox.vue';
export default defineComponent({
  components: { ModCheckbox },
  props: {
    mod: {
      type: Object as PropType<Mod>,
      required: true,
    },
  },
  setup(props) {
    const modsStore = useModsStore();
    const selectedMod = computed({
      get() {
        return modsStore.selectedMod;
      },
      set(mod) {
        modsStore.setSelectedMod(mod);
      },
    });
    const isActive = computed(() => selectedMod.value == props.mod.id);

    return {
      selectedMod,
      isActive,
    };
  },
});
</script>
