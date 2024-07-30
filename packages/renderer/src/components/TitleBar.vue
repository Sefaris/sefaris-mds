<template>
  <div class="title-bar">
    <div class="title">G3 ModStarter</div>
    <div class="controls">
      <div
        class="control minimize"
        @click="minimizeWindow"
      >
        <mdi-icon icon="mdi-window-minimize" />
      </div>
      <div class="control disabled">
        <mdi-icon icon="mdi-window-maximize" />
      </div>
      <div
        class="control close"
        @click="closeApplication"
      >
        <mdi-icon icon="mdi-window-close" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { minimizeWindow, closeApplication } from '#preload';

import MdiIcon from './MdiIcon.vue';
export default defineComponent({
  components: { MdiIcon },
  setup() {
    return { minimizeWindow, closeApplication };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $text-white;
  height: 32px;
  app-region: drag;

  .title {
    display: flex;
    align-items: center;
    padding: 8px;
    font-size: 15px;
  }

  .controls {
    display: flex;
    app-region: none;

    .control {
      width: 35px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        cursor: pointer;
      }
    }

    .disabled {
      color: $text-disabled;
    }

    .minimize:hover {
      background-color: rgba($white, 0.1);
    }

    .close:hover {
      background-color: #b92a20;
    }
  }
}
</style>
