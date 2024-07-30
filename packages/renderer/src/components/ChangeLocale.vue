<template>
  <div class="change-locale nav-top-wrapper">
    <dropdown
      center
      :show-caret="false"
    >
      <template #activator>
        <span
          class="nav-top-wrapper-flag"
          :class="'fi fi-' + flag"
        />
      </template>

      <button
        v-for="(lang, index) in LANGUAGE_SETTINGS"
        :key="index"
        href="#"
        class="dropdown-container-content-row cursor-pointer"
        @click.prevent="changeLanguage(lang.code)"
      >
        <span :class="'fi fi-' + lang.code" />

        <span>{{ lang.text }}</span>
      </button>
    </dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { loadConfiguration, saveConfiguration } from '#preload';
import Dropdown from './Dropdown.vue';

import type { SUPPORTED_LANGUAGES } from '../utils/constants';
import { DEFAULT_LANGUAGE, LANGUAGE_SETTINGS } from '../utils/constants';
import { i18n } from '../plugins/i18n';
const currentLanguageCode = ref(i18n.global.locale.value ?? DEFAULT_LANGUAGE);
const flag = computed(() => i18n.global.locale.value);
function changeLanguage(code: string) {
  if (currentLanguageCode.value === code) {
    return;
  }
  currentLanguageCode.value = code as SUPPORTED_LANGUAGES;
}

watch(
  () => currentLanguageCode.value,
  async () => {
    const configuration = await loadConfiguration();
    if (!configuration) return;
    configuration.language = currentLanguageCode.value;
    i18n.global.locale.value = currentLanguageCode.value as SUPPORTED_LANGUAGES;
    await saveConfiguration(configuration);
  },
);

onMounted(async () => {
  const configuration = await loadConfiguration();
  if (configuration) {
    i18n.global.locale.value = configuration.language as SUPPORTED_LANGUAGES;
  } else {
    i18n.global.locale.value = 'gb';
  }
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';
@import '../../assets/styles/mixins.scss';

button.dropdown-container-content-row {
  background: none;
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  gap: 12px;
  padding: $padding-tiny;

  &:focus {
    color: $accent;
  }
}

.change-locale {
  .dropdown-container-content {
    width: max-content;
    padding: $padding-tiny $padding-medium;
  }
}
</style>
