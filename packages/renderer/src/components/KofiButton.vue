<template>
  <div class="ml-7">
    <a
      class="flex bg-primary text-black rounded-lg px-3 py-1.5 hover:bg-primary-hover"
      href="#"
      target="_blank"
      @click="openWebsite(SEFARIS_KOFI)"
    >
      <span class="h-5">{{ $t('nav.top.support') }}</span>

      <img
        class="h-5 ml-3"
        src="https://storage.ko-fi.com/cdn/cup-border.png"
      />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { openWebsite } from '#preload';
import { SEFARIS_KOFI } from '../../../../utils/constants';
export default defineComponent({
  setup() {
    return { openWebsite, SEFARIS_KOFI };
  },
});
</script>
