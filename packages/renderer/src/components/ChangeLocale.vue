<template>
  <app-dropdown :show-caret="false">
    <template #activator>
      <span :class="'fi fi-' + flag" />
    </template>

    <button
      v-for="(lang, index) in LANGUAGE_SETTINGS"
      :key="index"
      class="flex items-center gap-3 rounded-md px-4 py-1.5 hover:bg-default-hover"
      @click="changeLanguage(lang.code)"
    >
      <span :class="'fi fi-' + lang.code" />
      <span>{{ lang.text }}</span>
    </button>
  </app-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { changeConfigLocale, loadConfiguration, saveConfiguration } from '#preload';
import AppDropdown from './AppDropdown.vue';

import type { SUPPORTED_LANGUAGES } from '../../../../utils/constants';
import { LANGUAGE_SETTINGS } from '../../../../utils/constants';
import { i18n } from '../../../../plugins/i18n';

const flag = computed(() => i18n.global.locale.value);

async function changeLanguage(code: string) {
  if (i18n.global.locale.value === code) {
    return;
  }
  changeConfigLocale(code);
  const configuration = await loadConfiguration();
  if (!configuration) return;
  configuration.language = code;
  i18n.global.locale.value = code as SUPPORTED_LANGUAGES;
  await saveConfiguration(configuration);
}
</script>
