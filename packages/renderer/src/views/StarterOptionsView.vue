<template>
  <div class="flex h-182 select-none flex-col items-center text-menu">
    <div class="h-174.5 w-full overflow-y-auto text-center">
      Hejka
      <div>Gothic Path: {{ configuration?.gothicPath }}</div>
      <div>Mods path: {{ configuration?.modsPath }}</div>
      <div>
        Ignore dependencies:
        <span @click="configuration!.ignoreDependencies = !configuration?.ignoreDependencies">
          {{ configuration?.ignoreDependencies }}
        </span>
      </div>
      <div>
        Ignore incompatible:
        <span @click="configuration!.ignoreIncompatible = !configuration?.ignoreIncompatible">
          {{ configuration?.ignoreIncompatible }}
        </span>
      </div>
    </div>

    <options-nav-buttons :save-method="saveConf" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import OptionsNavButtons from '../components/OptionsNavButtons.vue';
import type { AppConfiguration } from '@interfaces/AppConfiguration';
import { forceReloadConfig, loadConfiguration, saveConfiguration } from '#preload';

export default defineComponent({
  components: { OptionsNavButtons },
  setup() {
    const configuration = ref<AppConfiguration>();

    const saveConf = async () => {
      const clone = JSON.parse(JSON.stringify(configuration.value));
      await saveConfiguration(clone);
      forceReloadConfig();
    };

    onMounted(async () => {
      configuration.value = (await loadConfiguration()) as AppConfiguration;
    });

    return { saveConf, configuration };
  },
});
</script>
