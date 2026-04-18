<template>
  <app-modal
    :is-visible="$props.isVisible!"
    :title="$t($props.title)"
    :type="$props.type"
  >
    <div class="m-2 flex max-h-100 min-w-50 flex-col gap-2 overflow-y-auto whitespace-pre-wrap">
      {{ $props.message }}
    </div>
    <div class="ml-auto flex gap-2 p-px">
      <button
        class="border-divider hover:bg-disabled my-2 rounded-lg border-2 px-2 py-1"
        @click="$emit('cancel')"
      >
        {{ $t($props.cancelLabel!) }}
      </button>
      <button
        class="border-divider hover:bg-disabled my-2 mr-2 rounded-lg border-2 px-2 py-1"
        @click="$emit('confirm')"
      >
        {{ $t($props.confirmLabel) }}
      </button>
    </div>
  </app-modal>
</template>

<script lang="ts">
import AppModal from './AppModal.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { AppModal },
  props: {
    type: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    confirmLabel: {
      type: String,
      required: true,
    },
    cancelLabel: {
      type: String,
      default: 'modal.close',
    },
  },
  emits: ['confirm', 'cancel'],
  setup() {
    return {};
  },
});
</script>
