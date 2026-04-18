<template>
  <input
    ref="inputRef"
    :value="modelValue"
    class="border-primary/15 focus:border-primary h-6 rounded-md border-2 bg-gray-400/15 px-2 text-white placeholder-white/50 transition-colors duration-200 outline-none"
    :maxlength="maxlength"
    :placeholder="placeholder"
    @input="emitValue"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },

    placeholder: {
      type: String,
      default: '',
    },

    maxlength: {
      type: Number,
      default: 100,
    },
  },

  emits: ['update:modelValue'],

  setup(_, { emit }) {
    const inputRef = ref<HTMLInputElement>();

    const emitValue = (event: Event) => {
      emit('update:modelValue', (event.target as HTMLInputElement).value);
    };

    return {
      inputRef,

      emitValue,
    };
  },
});
</script>
