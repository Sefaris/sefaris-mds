<template>
  <button class="hover:text-primary">
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
  },
  setup() {
    return {};
  },
});
</script>
