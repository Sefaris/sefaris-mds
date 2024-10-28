<template>
  <input
    type="range"
    :min="$props.min"
    :max="$props.max"
    :value="sliderValue"
    :step="$props.step"
    class="slider h-0.5 cursor-pointer appearance-none bg-slider"
    @change="onSlide"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
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
  setup(props, emit) {
    const sliderValue = ref(props.value);
    const onSlide = (e: Event) => {
      const target = e.target as HTMLInputElement;
      sliderValue.value = Number(target.value);
      emit.emit('slide', sliderValue.value);
    };

    return { onSlide, sliderValue };
  },
});
</script>
