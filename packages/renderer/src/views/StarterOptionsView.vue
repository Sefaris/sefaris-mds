<template>
  <div class="flex h-182 select-none flex-col items-center text-menu">
    <div class="mt-2 select-none text-center text-xl">
      {{ $t('config.starter') }}
    </div>

    <div class="h-174.5 w-full overflow-y-auto text-center">
      <div class="mx-20 mt-3 flex select-none items-center justify-between">
        <config-tooltip :name="$t('config.gothicPath')">
          <span class="max-w-100">
            {{ $t('config.description.gothicPath') }}
          </span>
        </config-tooltip>
        <span
          class="h-6 cursor-pointer hover:text-menu-hover"
          @click="editGothicPath"
        >
          {{ configuration?.gothicPath }}
        </span>
      </div>

      <div class="mx-20 mt-3 flex select-none items-center justify-between">
        <config-tooltip :name="$t('config.modsPath')">
          <span class="max-w-100">
            {{ $t('config.description.modsPath') }}
          </span>
        </config-tooltip>
        <span
          class="h-6 cursor-pointer hover:text-menu-hover"
          @click="editModsPath"
        >
          {{ configuration?.modsPath }}
        </span>
      </div>
      <div class="mx-20 mt-3 flex select-none items-center justify-between">
        <config-tooltip :name="$t('config.ignoreDependencies')">
          <span class="max-w-100">
            {{ $t('config.description.ignoreDependencies') }}
          </span>
          <span> {{ $t('tooltip.default') }}: {{ $t('config.option.off') }} </span>
        </config-tooltip>
        <div class="flex items-center">
          <option-boolean-slider
            :value="configuration?.ignoreDependencies ? true : false"
            @slide="(n: boolean) => (configuration!.ignoreDependencies = n)"
          />
          <span
            v-if="configuration?.ignoreDependencies"
            class="min-w-50 text-right"
          >
            {{ $t('config.option.on') }}
          </span>
          <span
            v-else
            class="min-w-50 text-right"
          >
            {{ $t('config.option.off') }}
          </span>
        </div>
      </div>

      <div class="mx-20 mt-3 flex select-none items-center justify-between">
        <config-tooltip :name="$t('config.ignoreIncompatibles')">
          <span>
            {{ $t('config.description.ignoreIncompatibles') }}
          </span>
          <span> {{ $t('tooltip.default') }}: {{ $t('config.option.off') }} </span>
        </config-tooltip>
        <div class="flex items-center">
          <option-boolean-slider
            :value="configuration?.ignoreIncompatible ? true : false"
            @slide="(n: boolean) => (configuration!.ignoreIncompatible = n)"
          />
          <span
            v-if="configuration?.ignoreIncompatible"
            class="min-w-50 text-right"
          >
            {{ $t('config.option.on') }}
          </span>
          <span
            v-else
            class="min-w-50 text-right"
          >
            {{ $t('config.option.off') }}
          </span>
        </div>
      </div>
    </div>

    <options-nav-buttons :save-method="saveConf" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import OptionsNavButtons from '../components/OptionsNavButtons.vue';
import type { AppConfiguration } from '@interfaces/AppConfiguration';
import {
  forceReloadConfig,
  loadConfiguration,
  saveConfiguration,
  selectFolder,
  selectGameFolder,
} from '#preload';
import OptionBooleanSlider from '../components/OptionSliders/OptionBooleanSlider.vue';
import ConfigTooltip from '../components/ConfigTooltip.vue';

export default defineComponent({
  components: { OptionsNavButtons, OptionBooleanSlider, ConfigTooltip },
  setup() {
    const configuration = ref<AppConfiguration | null>();

    const saveConf = async () => {
      const clone = JSON.parse(JSON.stringify(configuration.value));
      await saveConfiguration(clone);
      forceReloadConfig();
    };

    const editGothicPath = async () => {
      const gamePath = await selectGameFolder();
      if (!gamePath) return;
      configuration.value!.gothicPath = gamePath;
    };

    const editModsPath = async () => {
      const modsPath = await selectFolder();
      if (!modsPath) return;
      configuration.value!.modsPath = modsPath;
    };

    onMounted(async () => {
      configuration.value = await loadConfiguration();
    });

    return {
      saveConf,
      configuration,
      editGothicPath,
      editModsPath,
    };
  },
});
</script>
