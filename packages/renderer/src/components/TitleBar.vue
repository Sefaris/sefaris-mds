<template>
  <div class="title-bar flex h-8 justify-between pl-2">
    <div class="py-1">G3 ModStarter</div>
    <div class="controls flex align-middle">
      <div
        class="hover:cursor-pointer hover:bg-primary-bg"
        @click="minimizeWindow"
      >
        <i class="mdi mdi-window-minimize"></i>
      </div>
      <div class="mx-2">
        <i class="mdi mdi-window-maximize disabled"></i>
      </div>
      <div
        class="pr-2 hover:cursor-pointer hover:bg-[#b92a20]"
        @click="closeApplication"
      >
        <i class="mdi mdi-window-close"></i>
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
