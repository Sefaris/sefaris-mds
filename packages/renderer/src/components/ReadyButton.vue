<template>
  <button
    class="mr-6 h-15 w-78.75 bg-play"
    @click="play()"
  >
    <span class="font-gothic text-3xl">
      {{ $t('action.play') }}
    </span>
  </button>
</template>

<script lang="ts">
import { startGame } from '#preload';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const play = async () => {
      await startGame();
    };

    return { play };
  },
});
</script>
