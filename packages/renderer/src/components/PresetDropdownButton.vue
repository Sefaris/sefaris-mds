<template>
  <div
    class="flex w-full items-center rounded-md hover:bg-default-hover"
    :class="{
      'border-r-4 border-primary': $props.active,
      'border-r-4 border-primary/40': $props.modified,
    }"
  >
    <button
      class="flex-1 px-4 py-1.5 text-left"
      @click="selectPreset($props.preset)"
    >
      {{ presetName }} ({{ $props.modsCount }})
      <span
        v-if="$props.modified"
        class="text-xs text-gray-400"
      >*</span>
    </button>
    <button
      v-if="$props.active || $props.modified"
      class="mr-2 px-1 text-gray-400 hover:text-white"
      @click.stop="$emit('deselect')"
    >
      <i class="mdi mdi-close mdi-small" />
    </button>
  </div>
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
      default: false,
    },
    modified: {
      type: Boolean,
      default: false,
    },
    modsCount: {
      type: Number,
      required: true,
    },
  },
  emits: ['deselect'],
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
