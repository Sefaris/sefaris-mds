<template>
  <div class="absolute top-0 left-0 h-2 w-full">
    <div
      class="bg-primary h-2 duration-200 ease-in"
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
