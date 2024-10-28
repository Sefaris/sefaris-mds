<template>
  <button
    class="mr-6 h-15 w-78.75 bg-play"
    @click="play()"
  >
    <span
      class="font-gothic text-3xl"
      :class="{ 'font-lato': currentLanguage == 'ru' }"
    >
      {{ $t('action.play') }}
    </span>
  </button>
</template>

<script lang="ts">
import { startGame } from '#preload';
import { defineComponent, computed } from 'vue';
import { i18n } from '../../../../plugins/i18n';

export default defineComponent({
  setup() {
    const currentLanguage = computed(() => i18n.global.locale.value);

    const play = async () => {
      await startGame();
    };

    return { play, currentLanguage };
  },
});
</script>
