<template>
  <button
    class="h-full"
    :class="{ 'shadow-[inset_0_-2px_0_0_#c7f148]': $props.active, 'text-light': $props.disabled }"
    :disabled="$props.disabled"
    @click="displayCategory($props.category)"
  >
    {{ $t(`nav.bottom.${$props.category}`) }} ({{ $props.modsCounter }})
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useModsStore } from '../stores/mods-store';

export default defineComponent({
  components: {},
  props: {
    category: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modsCounter: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const modsStore = useModsStore();

    const displayCategory = (category: string) => {
      modsStore.displayCategory(category);
    };

    return {
      displayCategory,
    };
  },
});
</script>
