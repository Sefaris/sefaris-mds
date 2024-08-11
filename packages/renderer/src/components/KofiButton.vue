<template>
  <div class="ml-7">
    <a
      class="flex rounded-lg bg-primary px-3 py-1.5 text-black hover:bg-primary-hover"
      href="#"
      target="_blank"
      @click="openWebsite(SEFARIS_KOFI)"
    >
      <span class="h-5">{{ $t('nav.top.support') }}</span>

      <img
        class="ml-3 h-5"
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
