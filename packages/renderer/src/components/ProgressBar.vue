<template>
  <div class="progress">
    <div
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>
    <span class="progress-name">{{ $t(action) }} {{ step + "/" + maxSteps }}</span>
  </div>
</template>

<script lang="ts">
import type { ProgressStatus } from '#preload';
import { defineComponent, ref } from 'vue';

export default defineComponent({

  setup() {
    const action = ref('progress.wait');
    const progress = ref(0);
    const step = ref(0);
    const maxSteps = ref(0);
    window.addEventListener('message', event => {
      const status = event.data as ProgressStatus;
      step.value = status.step;
      maxSteps.value = status.maxSteps - 1;
      const val = Math.floor(status.step / maxSteps.value * 100);
      progress.value = val;
      action.value = status.actionName;
    });

    return { action, progress, step, maxSteps };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.progress {
  width: 100%;
  height: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  margin-top: auto;
  position: relative;

  &-name {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
  }

  &-bar {
    position: relative;

    height: 100%;
    background-color: #00a0e9;
  }
}
</style>
