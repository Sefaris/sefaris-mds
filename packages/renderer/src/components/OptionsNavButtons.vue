<template>
  <div class="border-divider flex w-full justify-evenly border-t py-6">
    <button
      class="bg-option-button font-gothic hover:text-menu-hover h-12 w-45 bg-cover bg-no-repeat text-2xl"
      :class="{ 'font-lato': currentLanguage == 'ru' }"
      @click="$router.back()"
    >
      <span
        class="block transition-transform duration-150 ease-in-out active:translate-x-0.5 active:translate-y-0.5"
      >
        {{ $t('config.nav.back') }}
      </span>
    </button>

    <button
      class="bg-option-button font-gothic hover:text-menu-hover h-12 w-45 bg-cover bg-no-repeat text-2xl"
      :class="{ 'font-lato': currentLanguage == 'ru' }"
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
import { defineComponent, computed } from 'vue';
import { i18n } from '../../../../plugins/i18n';

export default defineComponent({
  props: {
    saveMethod: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const currentLanguage = computed(() => i18n.global.locale.value);
    return { currentLanguage };
  },
});
</script>
