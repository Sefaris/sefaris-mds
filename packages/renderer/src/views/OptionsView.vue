<template>
  <div class="flex h-182 select-none flex-col items-center text-menu">
    <ini-configuration-record
      ref="configRecord"
      :config-name="configName"
    />
    <div class="flex w-full justify-evenly border-t border-divider py-6">
      <button
        class="h-12 w-45 bg-[url('../assets/images/option-button.png')] bg-cover bg-no-repeat font-gothic text-2xl hover:text-menu-hover"
        @click="$router.back()"
      >
        <span
          class="block transition-transform duration-150 ease-in-out active:translate-x-0.5 active:translate-y-0.5"
        >
          {{ $t('config.nav.back') }}
        </span>
      </button>

      <button
        class="h-12 w-45 bg-[url('../assets/images/option-button.png')] bg-cover bg-no-repeat font-gothic text-2xl hover:text-menu-hover"
        @click="saveConfig"
      >
        <span
          class="block transition-transform duration-150 ease-in-out active:translate-x-0.5 active:translate-y-0.5"
        >
          {{ $t('config.nav.save') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import IniConfigurationRecord from '../components/IniConfigurationRecord.vue';
import { saveIniConfiguration } from '#preload';
import type { ConfigRecord } from '@interfaces/ConfigRecord';

export default defineComponent({
  components: { IniConfigurationRecord },
  setup() {
    const route = useRoute();
    const configName = ref<string>((route.params.ini as string) || '');
    const configRecord = ref<ConfigRecord>();

    const saveConfig = async () => {
      console.log(`Saving ${configName.value}`);
      if (configRecord.value) {
        const configSectionsCopy = JSON.parse(JSON.stringify(configRecord.value.sections));
        await saveIniConfiguration(configSectionsCopy, configName.value);
      }
    };

    return { saveConfig, configName, configRecord };
  },
});
</script>
