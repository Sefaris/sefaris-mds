<template>
  <div class="absolute left-0 top-0 h-2 w-full">
    <div
      class="h-2 bg-primary duration-200 ease-in"
      :style="{ width: progressValue }"
    />
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
    const progressValue = ref('0%');

    watch(
      () => props.progress,
      newValue => {
        progressValue.value = `${newValue}%`;
      },
    );

    return {
      progressValue,
    };
  },
});
</script>
