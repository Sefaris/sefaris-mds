<template>
  <input
    type="range"
    :min="$props.min"
    :max="$props.max"
    :value="$props.value"
    :step="$props.step"
    class="slider bg-slider h-0.5 cursor-pointer appearance-none"
    @input="onSlide"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      default: 1,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  emits: ['slide'],
  setup(_props, emit) {
    const onSlide = (e: Event) => {
      const target = e.target as HTMLInputElement;
      emit.emit('slide', Number(target.value));
    };

    return { onSlide };
  },
});
</script>
