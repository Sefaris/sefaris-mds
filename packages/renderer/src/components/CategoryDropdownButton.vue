<template>
  <button
    class="hover:bg-default-hover rounded-md py-1.5 px-4"
    :class="{
      'border-r-4 border-primary': $props.active,
    }"
    @click="displayCategory(category)"
  >
    {{ $props.category }} ({{ $props.modsCount }})
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useModsStore } from '../stores/mods-store';

export default defineComponent({
  props: {
    category: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    modsCount: {
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
