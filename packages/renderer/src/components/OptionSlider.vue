<template>
  <input
    type="range"
    :min="$props.min"
    :max="$props.max"
    :value="sliderValue"
    class="slider cursor-pointer appearance-none"
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
    return { onSlide, sliderValue };
  },
});
</script>

<style lang="scss">
.slider {
  appearance: none;
  height: 2px;
  background: #312e2c;

  &::-webkit-slider-thumb {
    background: url('../../assets/images/slider-thumb.png');
    width: 16px;
    height: 16px;
    appearance: none;
    transition: transform 1.3s ease;
  }
}
</style>
