<template>
  <div class="progress">
    <div
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>
    <span class="progress-name">{{ actionName }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    actionName: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    return {};
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
    transition: width 0.5s ease-in-out;
  }
}
</style>
