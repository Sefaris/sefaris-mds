<template>
  <div class="text-menu flex min-h-0 flex-1 flex-col items-center select-none">
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
import { saveIniConfiguration, showAlert } from '#preload';
import type { ConfigRecord } from '@interfaces/ConfigRecord';
import OptionsNavButtons from '../components/OptionsNavButtons.vue';
import { translate } from '../../../../plugins/i18n';

export default defineComponent({
  components: { IniConfigurationRecord, OptionsNavButtons },
  setup() {
    const route = useRoute();
    const configName = ref<string>((route.params.ini as string) || '');
    const configRecord = ref<ConfigRecord>();

    const saveConfig = async () => {
      if (configRecord.value) {
        const configSectionsCopy = JSON.parse(JSON.stringify(configRecord.value.sections));
        saveIniConfiguration(configSectionsCopy, configName.value)
          .then(() => {
            showAlert('modal.success', translate('alert.iniSaved'), 'success');
          })
          .catch(error => {
            showAlert('modal.error', error.message, 'error');
          });
      }
    };

    return { saveConfig, configName, configRecord };
  },
});
</script>
