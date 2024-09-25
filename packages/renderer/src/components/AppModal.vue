<template>
  <div
    v-if="isVisible"
    class="modal-border fixed left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col rounded-md bg-modal"
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
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.modal-border {
  border-image: url('@assets/images/option-button.png') 20;
  border-width: 20px;
}
</style>
