<template>
  <div class="title-bar flex h-8 shrink-0 justify-between pl-2 select-none">
    <div class="py-1"> G3 Sefaris ModManager {{ appVersion }} </div>
    <div class="controls flex align-middle">
      <div
        class="hover:bg-primary-bg px-1.5 hover:cursor-pointer"
        @click="minimizeWindow"
      >
        <i class="mdi mdi-window-minimize" />
      </div>
      <div
        class="hover:bg-primary-bg px-1.5 hover:cursor-pointer"
        @click="maximizeWindow"
      >
        <i class="mdi mdi-window-maximize" />
      </div>
      <div
        class="hover:bg-close px-2 hover:cursor-pointer"
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

const appVersion = import.meta.env.VITE_APP_VERSION;

export default defineComponent({
  setup() {
    return { minimizeWindow, maximizeWindow, closeApplication, appVersion };
  },
});
</script>
