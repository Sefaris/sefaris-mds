<template>
  <div class="absolute left-0 top-0 h-2 w-200">
    <div
      class="h-2 bg-primary duration-200 ease-in"
      :style="{ width: progressValue }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  props: {
    progress: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const WIDTH = 800;
    const progressValue = ref('0px');

    watch(
      () => props.progress,
      newValue => {
        progressValue.value = `${(newValue / 100) * WIDTH}px`;
      },
    );

    return {
      progressValue,
    };
  },
});
</script>
