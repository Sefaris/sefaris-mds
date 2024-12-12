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
        v-if="$props.showLogButton"
        class="my-2 rounded-lg border-2 border-divider px-2 py-1 hover:bg-disabled"
        @click="openDocumentsFolder"
      >
        {{ $t('modal.openDocuments') }}
      </button>
      <button
        class="my-2 mr-2 rounded-lg border-2 border-divider px-2 py-1 hover:bg-disabled"
        @click="$emit('close')"
      >
        {{ $t('modal.close') }}
      </button>
    </div>
  </app-modal>
</template>

<script lang="ts">
import AppModal from './AppModal.vue';
import { defineComponent } from 'vue';
import { openDocumentsFolder } from '#preload';

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
    showLogButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup() {
    return {};
  },
  methods: { openDocumentsFolder },
});
</script>
