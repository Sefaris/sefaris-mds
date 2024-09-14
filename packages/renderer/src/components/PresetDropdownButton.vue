<template>
  <button
    class="w-full rounded-md px-4 py-1.5 hover:bg-default-hover"
    :class="{
      'border-r-4 border-primary': $props.active,
    }"
    @click="selectPreset($props.preset)"
  >
    {{ presetName }} ({{ $props.modsCount }})
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useModsStore } from '../stores/mods-store';

export default defineComponent({
  props: {
    preset: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    modsCount: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const modsStore = useModsStore();
    const presetName = computed(() => {
      if (props.preset.length > 40) {
        return props.preset.slice(0, 40) + '...';
      } else {
        return props.preset;
      }
    });
    const selectPreset = (preset: string) => {
      modsStore.selectPreset(preset);
    };

    return {
      selectPreset,
      presetName,
    };
  },
});
</script>
