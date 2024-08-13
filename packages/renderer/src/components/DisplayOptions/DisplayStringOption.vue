<template>
  <display-base-option :option="$props.option">
    {{ $props.option.name }}
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, toRef } from 'vue';
import type { ConfigOption } from '@interfaces/ConfigOption';
import DisplayBaseOption from './DisplayBaseOption.vue';

export default defineComponent({
  components: { DisplayBaseOption },

  props: {
    option: {
      type: Object as PropType<ConfigOption>,
      required: true,
    },
  },
  emits: ['updateOption'],
  setup(props) {
    const setting = toRef(props.option);
    return { setting };
  },
});
</script>
