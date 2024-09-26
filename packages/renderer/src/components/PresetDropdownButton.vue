<template>
  <button
    class="w-full rounded-md px-4 py-1.5 hover:bg-default-hover"
    :class="{
      'border-r-4 border-primary': $props.active,
    }"
    @click="selectPreset($props.preset)"
  >
    {{ $props.preset }} ({{ $props.modsCount }})
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useModsStore } from '../stores/mods-store';

export default defineComponent({
  props: {
    preset: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    modsCount: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const modsStore = useModsStore();

    const selectPreset = (preset: string) => {
      modsStore.selectPreset(preset);
    };

    return {
      selectPreset,
    };
  },
});
</script>
