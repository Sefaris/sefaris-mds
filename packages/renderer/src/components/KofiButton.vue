<template>
  <div class="kofi">
    <a
      class="kofi--cta"
      href="#"
      target="_blank"
      @click="openWebsite(SEFARIS_KOFI)"
    >
      {{ $t('nav.top.support') }}

      <img src="https://storage.ko-fi.com/cdn/cup-border.png" />
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
