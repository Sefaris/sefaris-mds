<template>
  <display-base-option :option="$props.option"> </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
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
  setup(_) {
    return {};
  },
});
</script>
