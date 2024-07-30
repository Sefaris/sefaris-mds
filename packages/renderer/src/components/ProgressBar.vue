<template>
  <div class="progress-bar">
    <div
      v-if="false"
      class="progress-value"
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
    const progressValue = ref('600px');

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

<style lang="scss">
@import '../../assets/styles/variables.scss';

.progress-bar {
  width: $app-width;
  height: $progress-bar-height;
}

.progress-value {
  height: $progress-bar-height;
  background-color: $primary-color;
  transition: width $animation-duration-short linear;
}
</style>
