<template>
  <button
    :class="{
      'cursor-default text-light hover:text-light': $props.disabled,
      'hover:text-primary': !$props.disabled,
    }"
    :disabled="$props.disabled"
  >
    {{ $t(`nav.top.${$props.title}`) }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
});
</script>
