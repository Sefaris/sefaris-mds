<template>
  <input
    type="range"
    :min="$props.min"
    :max="$props.max"
    :value="sliderValue"
    class="slider h-0.5 cursor-pointer appearance-none bg-slider"
    @change="onSlide"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['slide'],
  setup(props, emit) {
    const sliderValue = ref(props.value ? 1 : 0);
    const onSlide = (e: Event) => {
      const target = e.target as HTMLInputElement;
      sliderValue.value = Number(target.value);
      emit.emit('slide', Boolean(sliderValue.value));
    };

    watch(
      () => props.value,
      newValue => {
        sliderValue.value = newValue ? 1 : 0;
      },
    );

    return { onSlide, sliderValue };
  },
});
</script>
