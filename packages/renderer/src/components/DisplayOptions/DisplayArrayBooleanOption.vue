<template>
  <display-base-option :option="$props.option">
    <!-- NEVER TO BE USED? -->
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
  setup(props) {
    const setting = toRef(props.option);
    return { setting };
  },
});
</script>
