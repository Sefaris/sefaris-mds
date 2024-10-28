<template>
  <app-modal
    :is-visible="$props.isVisible!"
    :title="$t($props.title)"
    :type="$props.type"
  >
    <div class="m-2 flex min-w-50 flex-col gap-2">
      {{ $props.message }}
      <div class="ml-auto mt-auto flex gap-2 p-px">
        <button
          class="rounded-lg border-2 border-divider px-2 py-1 hover:bg-disabled"
          @click="$emit('close')"
        >
          {{ $t('modal.close') }}
        </button>
      </div>
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
  },
  emits: ['close'],
  setup() {
    return {};
  },
});
</script>
