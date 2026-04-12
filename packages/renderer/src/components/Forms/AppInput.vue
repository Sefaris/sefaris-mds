<template>
  <input
    ref="inputRef"
    :value="modelValue"
    class="h-6 rounded-md border-2 border-primary/15 bg-gray-400/15 px-2 text-white placeholder-white/50 outline-none transition-colors duration-200 focus:border-primary"
    :maxlength="maxlength"
    :placeholder="placeholder"
    @input="emitValue"
  >
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
