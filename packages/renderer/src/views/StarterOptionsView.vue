<template>
  <div class="text-menu flex min-h-0 flex-1 flex-col items-center select-none">
    <div class="mt-2 text-center text-xl select-none">
      {{ $t('config.starter') }}
    </div>

    <div class="min-h-0 w-full flex-1 overflow-y-auto text-center">
      <div class="mx-20 mt-3 flex items-center justify-between select-none">
        <config-tooltip :name="$t('config.gothicPath')">
          <span class="max-w-100">
            {{ $t('config.description.gothicPath') }}
          </span>
        </config-tooltip>
        <span
          class="hover:text-menu-hover h-6 cursor-pointer"
          @click="editGothicPath"
        >
          {{ configuration?.gothicPath }}
        </span>
      </div>

      <div class="mx-20 mt-3 flex items-center justify-between select-none">
        <config-tooltip :name="$t('config.modsPath')">
          <span class="max-w-100">
            {{ $t('config.description.modsPath') }}
          </span>
        </config-tooltip>
        <span
          class="hover:text-menu-hover h-6 cursor-pointer"
          @click="editModsPath"
        >
          {{ configuration?.modsPath }}
        </span>
      </div>
      <div class="mx-20 mt-3 flex items-center justify-between select-none">
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

      <div class="mx-20 mt-3 flex items-center justify-between select-none">
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
