<template>
  <div
    v-if="isVisible"
    class="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col rounded-md border-2 border-solid border-divider bg-primary-bg"
  >
    <div class="my-1 border-b border-divider px-1">
      {{ $props.title }}
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
  },
});
</script>
