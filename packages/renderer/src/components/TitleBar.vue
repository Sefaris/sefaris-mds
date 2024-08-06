<template>
  <div class="title-bar flex justify-between h-8 pl-2">
    <div class="py-1">G3 ModStarter</div>
    <div class="flex controls align-middle">
      <div
        class="hover:cursor-pointer hover:bg-primary-bg"
        @click="minimizeWindow"
      >
        <span class="mdi mdi-window-minimize"></span>
      </div>
      <div class="mx-2">
        <span class="mdi mdi-window-maximize disabled"></span>
      </div>
      <div
        class="hover:cursor-pointer hover:bg-[#b92a20] pr-2"
        @click="closeApplication"
      >
        <span class="mdi mdi-window-close"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { minimizeWindow, closeApplication } from '#preload';

export default defineComponent({
  setup() {
    return { minimizeWindow, closeApplication };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.title-bar {
  -webkit-app-region: drag;
}
.mdi {
  font-size: 24px;
}
.disabled {
  color: $text-disabled;
}
.controls {
  -webkit-app-region: none;
}
</style>
