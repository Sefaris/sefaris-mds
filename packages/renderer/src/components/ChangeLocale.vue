<template>
  <div style="display:inline-block">
    <dropdown-menu
      center
      :show-caret="false"
    >
      <template #activator>
        <span :class="'fi fi-' + currentLanguage?.code" />
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
    </dropdown-menu>
  </div>
</template>

<script lang="ts">

import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { i18n, DEFAULT_LANGUAGE, LANGUAGE_SETTINGS } from './../plugins/i18n';
import type { SUPPORTED_LANGUAGES } from './../plugins/i18n';
import DropdownMenu from './DropdownMenu.vue';
import { useRoute } from 'vue-router';
export default defineComponent({
    components: { DropdownMenu },

    setup() {
        const route = useRoute();

        const currentLanguageCode = ref(DEFAULT_LANGUAGE);
        const currentLanguage = computed(() => LANGUAGE_SETTINGS.find(entry => entry.code === currentLanguageCode.value));

        function changeLanguage(code: string) {
            if (currentLanguageCode.value === code) {
                return;
            }
            currentLanguageCode.value = code;
        }

        watch(
            () => currentLanguageCode.value,
            () => {
                i18n.global.locale.value = currentLanguageCode.value as SUPPORTED_LANGUAGES;
            },
        );


        onMounted(() => {
            const langFromQuery = route.query.lang;
            if (langFromQuery && LANGUAGE_SETTINGS.find(entry => entry.code === langFromQuery)) {
                currentLanguageCode.value = langFromQuery as string;
                localStorage.setItem('language', currentLanguageCode.value);
                return;
            }

            const storageLanguage = localStorage.getItem('language');

            if (!storageLanguage) {
                return;
            }

            if (currentLanguageCode.value === storageLanguage) {
                return;
            }

            currentLanguageCode.value = storageLanguage;
        });

        return {
            currentLanguage, LANGUAGE_SETTINGS, changeLanguage,
        };
    },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';
</style>
