<template>
  <div
    class="mx-20 mt-3 flex items-center justify-between"
    :title="$props.option.description"
  >
    <span class="min-w-50 text-left">
      {{ $props.option.name }}
    </span>
    <slot />
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { ConfigOption } from '@interfaces/ConfigOption';
export default defineComponent({
  props: {
    option: {
      type: Object as PropType<ConfigOption>,
      required: true,
    },
  },
  setup(_) {
    return {};
  },
});
</script>
