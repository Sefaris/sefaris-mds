<template>
  <div class="kofi">
    <a
      class="kofi--cta"
      href="#"
      target="_blank"
      @click="openWebsite('https://ko-fi.com/sefaris')"
    >
      {{ $t('nav.top.support') }}

      <img src="https://storage.ko-fi.com/cdn/cup-border.png" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { openWebsite } from '#preload';
export default defineComponent({
  setup() {
    return { openWebsite };
  },
});
</script>
