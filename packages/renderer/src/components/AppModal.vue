<template>
  <div
    v-if="isVisible"
    class="absolute left-0 top-0 z-10 h-190 w-200 select-none bg-black bg-opacity-60"
  >
    <div
      v-if="isVisible"
      class="modal-border fixed left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col bg-modal"
    >
      <div
        class="my-1 border-b border-divider px-1 text-2xl"
        :class="{
          'text-error': $props.type == 'error',
          'text-success': $props.type == 'success',
          'text-warning': $props.type == 'warning',
          'text-info': $props.type == 'info',
        }"
      >
        {{ $props.title }}
      </div>
      <slot />
    </div>
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
    type: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss">
.modal-border {
  border-image: url('@assets/images/option-button.png') 12;
  border-width: 12px;
}
</style>
