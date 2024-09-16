<template>
  <div class="flex w-full justify-evenly border-t border-divider py-6">
    <button
      class="h-12 w-45 bg-option-button bg-cover bg-no-repeat font-gothic text-2xl hover:text-menu-hover"
      @click="$router.back()"
    >
      <span
        class="block transition-transform duration-150 ease-in-out active:translate-x-0.5 active:translate-y-0.5"
      >
        {{ $t('config.nav.back') }}
      </span>
    </button>

    <button
      class="h-12 w-45 bg-option-button bg-cover bg-no-repeat font-gothic text-2xl hover:text-menu-hover"
      @click="$props.saveMethod()"
    >
      <span
        class="block transition-transform duration-150 ease-in-out active:translate-x-0.5 active:translate-y-0.5"
      >
        {{ $t('config.nav.save') }}
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    saveMethod: {
      type: Function,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
