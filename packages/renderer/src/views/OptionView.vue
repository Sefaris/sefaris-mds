<template>
  <div class="flex h-182 select-none flex-col items-center text-menu">
    <ini-configuration-record
      ref="configRecord"
      :config-name="configName"
    />
    <options-nav-buttons :save-method="saveConfig" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import IniConfigurationRecord from '../components/IniConfigurationRecord.vue';
import { saveIniConfiguration } from '#preload';
import type { ConfigRecord } from '@interfaces/ConfigRecord';
import OptionsNavButtons from '../components/OptionsNavButtons.vue';

export default defineComponent({
  components: { IniConfigurationRecord, OptionsNavButtons },
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
