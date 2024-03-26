<template>
  <div class="title-bar">
    <div class="title">
      <img
        class="icon"
        :src="icon"
      />Sefaris ModStarter
    </div>
    <div class="controls">
      <div
        class="control minimize"
        @click="minimizeWindow"
      >
        <mdi-icon icon="mdi-window-minimize" />
      </div>
      <div
        class="control close"
        @click="closeApplication"
      >
        <mdi-icon icon="mdi-close" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';

import {minimizeWindow, closeApplication, loadIcon} from '#preload';

import MdiIcon from './MdiIcon.vue';
export default defineComponent({
  components: {MdiIcon},
  setup() {
    const icon = ref('');
    (async () => {
      icon.value = await loadIcon();
    })();
    return {icon, minimizeWindow, closeApplication};
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $title-bar-color;
  color: $text-color;
  height: 30px;
  app-region: drag;
  border-bottom: 1px solid $divider-color;

  .icon {
    height: 30px;
    padding: 2.5px;
  }

  .title {
    display: flex;
    align-items: center;

    height: 100%;
    font-size: 18px;
  }

  .controls {
    display: flex;
    gap: 5px;
    app-region: none;

    .control {
      width: 50px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        cursor: pointer;
      }
    }

    .minimize:hover {
      background-color: $title-bar-hover-color;
    }

    .maximize:hover {
      background-color: $title-bar-hover-color;
    }

    .close:hover {
      background-color: #b92a20;
    }
  }
}
</style>
