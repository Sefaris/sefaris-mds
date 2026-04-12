<template>
  <div class="title-bar flex h-8 shrink-0 select-none justify-between pl-2">
    <div class="py-1">
      G3 Sefaris ModManager 1.0.2
    </div>
    <div class="controls flex align-middle">
      <div
        class="px-1.5 hover:cursor-pointer hover:bg-primary-bg"
        @click="minimizeWindow"
      >
        <i class="mdi mdi-window-minimize" />
      </div>
      <div
        class="px-1.5 hover:cursor-pointer hover:bg-primary-bg"
        @click="maximizeWindow"
      >
        <i class="mdi mdi-window-maximize" />
      </div>
      <div
        class="px-2 hover:cursor-pointer hover:bg-close"
        @click="closeApplication"
      >
        <i class="mdi mdi-window-close" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { minimizeWindow, maximizeWindow, closeApplication } from '#preload';

export default defineComponent({
  setup() {
    return { minimizeWindow, maximizeWindow, closeApplication };
  },
});
</script>
