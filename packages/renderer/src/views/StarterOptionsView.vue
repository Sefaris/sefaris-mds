<template>
  <div class="text-menu flex min-h-0 flex-1 flex-col items-center select-none">
    <div class="mt-2 text-center text-xl select-none">
      {{ $t('config.starter') }}
    </div>

    <div class="min-h-0 w-full flex-1 overflow-y-auto text-center">
      <div class="mx-20 mt-3 flex items-center justify-between gap-4 select-none">
        <config-tooltip
          :name="$t('config.gothicPath')"
          :highlight="isDirty('gothicPath')"
        >
          <span class="max-w-100">
            {{ $t('config.description.gothicPath') }}
          </span>
        </config-tooltip>
        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="hover:text-menu-hover h-6 w-6 cursor-pointer text-base leading-none"
            :class="isDirty('gothicPath') ? 'visible' : 'invisible'"
            :title="$t('tooltip.revert')"
            :aria-hidden="!isDirty('gothicPath')"
            :tabindex="isDirty('gothicPath') ? 0 : -1"
            @click="revert('gothicPath')"
          >
            <i class="mdi mdi-undo-variant" />
          </button>
          <span
            class="hover:text-menu-hover h-6 cursor-pointer"
            @click="editGothicPath"
          >
            {{ configuration?.gothicPath }}
          </span>
        </div>
      </div>

      <div class="mx-20 mt-3 flex items-center justify-between gap-4 select-none">
        <config-tooltip
          :name="$t('config.modsPath')"
          :highlight="isDirty('modsPath')"
        >
          <span class="max-w-100">
            {{ $t('config.description.modsPath') }}
          </span>
        </config-tooltip>
        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="hover:text-menu-hover h-6 w-6 cursor-pointer text-base leading-none"
            :class="isDirty('modsPath') ? 'visible' : 'invisible'"
            :title="$t('tooltip.revert')"
            :aria-hidden="!isDirty('modsPath')"
            :tabindex="isDirty('modsPath') ? 0 : -1"
            @click="revert('modsPath')"
          >
            <i class="mdi mdi-undo-variant" />
          </button>
          <span
            class="hover:text-menu-hover h-6 cursor-pointer"
            @click="editModsPath"
          >
            {{ configuration?.modsPath }}
          </span>
        </div>
      </div>

      <div class="mx-20 mt-3 flex items-center justify-between gap-4 select-none">
        <config-tooltip
          :name="$t('config.ignoreDependencies')"
          :highlight="isDirty('ignoreDependencies')"
        >
          <span class="max-w-100">
            {{ $t('config.description.ignoreDependencies') }}
          </span>
          <span> {{ $t('tooltip.default') }}: {{ $t('config.option.off') }} </span>
        </config-tooltip>
        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="hover:text-menu-hover h-6 w-6 cursor-pointer text-base leading-none"
            :class="isDirty('ignoreDependencies') ? 'visible' : 'invisible'"
            :title="$t('tooltip.revert')"
            :aria-hidden="!isDirty('ignoreDependencies')"
            :tabindex="isDirty('ignoreDependencies') ? 0 : -1"
            @click="revert('ignoreDependencies')"
          >
            <i class="mdi mdi-undo-variant" />
          </button>
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
      </div>

      <div class="mx-20 mt-3 flex items-center justify-between gap-4 select-none">
        <config-tooltip
          :name="$t('config.ignoreIncompatibles')"
          :highlight="isDirty('ignoreIncompatible')"
        >
          <span>
            {{ $t('config.description.ignoreIncompatibles') }}
          </span>
          <span> {{ $t('tooltip.default') }}: {{ $t('config.option.off') }} </span>
        </config-tooltip>
        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="hover:text-menu-hover h-6 w-6 cursor-pointer text-base leading-none"
            :class="isDirty('ignoreIncompatible') ? 'visible' : 'invisible'"
            :title="$t('tooltip.revert')"
            :aria-hidden="!isDirty('ignoreIncompatible')"
            :tabindex="isDirty('ignoreIncompatible') ? 0 : -1"
            @click="revert('ignoreIncompatible')"
          >
            <i class="mdi mdi-undo-variant" />
          </button>
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
      <div class="mx-20 mt-3 flex items-center justify-between gap-4 select-none">
        <config-tooltip
          :name="$t('config.modListMode.label')"
          :highlight="isDirty('modListMode')"
        >
          <span class="max-w-100">
            {{ $t('config.description.modListMode') }}
          </span>
          <span> {{ $t('tooltip.default') }}: {{ $t('config.modListMode.flat') }} </span>
        </config-tooltip>
        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="hover:text-menu-hover h-6 w-6 cursor-pointer text-base leading-none"
            :class="isDirty('modListMode') ? 'visible' : 'invisible'"
            :title="$t('tooltip.revert')"
            :aria-hidden="!isDirty('modListMode')"
            :tabindex="isDirty('modListMode') ? 0 : -1"
            @click="revert('modListMode')"
          >
            <i class="mdi mdi-undo-variant" />
          </button>
          <div class="flex items-center gap-3">
            <button
              v-for="mode in ['flat', 'grouped'] as const"
              :key="mode"
              type="button"
              class="flex cursor-pointer items-center gap-2"
              @click="setModListMode(mode)"
            >
              <span>{{ $t(`config.modListMode.${mode}`) }}</span>
              <span
                class="h-5 w-5 rounded-full border-2"
                :class="[
                  currentModListMode === mode ? 'bg-checkbox-active' : 'bg-checkbox-inactive',
                ]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <options-nav-buttons :save-method="saveConf" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue';
import OptionsNavButtons from '../components/OptionsNavButtons.vue';
import type { AppConfiguration, ModListMode } from '@interfaces/AppConfiguration';
import {
  forceReloadConfig,
  loadConfiguration,
  saveConfiguration,
  selectFolder,
  selectGameFolder,
} from '#preload';
import OptionBooleanSlider from '../components/OptionSliders/OptionBooleanSlider.vue';
import ConfigTooltip from '../components/ConfigTooltip.vue';

type TrackedField =
  | 'gothicPath'
  | 'modsPath'
  | 'ignoreDependencies'
  | 'ignoreIncompatible'
  | 'modListMode';

export default defineComponent({
  components: { OptionsNavButtons, OptionBooleanSlider, ConfigTooltip },
  setup() {
    const configuration = ref<AppConfiguration | null>();
    // Snapshot the loaded configuration so we can detect unsaved edits and revert per-field.
    const original = ref<AppConfiguration | null>(null);

    const snapshot = () => {
      original.value = configuration.value ? JSON.parse(JSON.stringify(configuration.value)) : null;
    };

    const isDirty = (field: TrackedField): boolean => {
      if (!configuration.value || !original.value) return false;
      if (field === 'modListMode') {
        return getModListMode(configuration.value) !== getModListMode(original.value);
      }
      return configuration.value[field] !== original.value[field];
    };

    const revert = (field: TrackedField) => {
      if (!configuration.value || !original.value) return;
      if (field === 'modListMode') {
        setConfigModListMode(configuration.value, getModListMode(original.value));
        return;
      }
      (configuration.value as AppConfiguration)[field] = original.value[field] as never;
    };

    const getModListMode = (config: AppConfiguration): ModListMode =>
      config.uiPreferences?.modListMode ?? 'flat';

    const setConfigModListMode = (config: AppConfiguration, mode: ModListMode) => {
      if (!config.uiPreferences) {
        config.uiPreferences = { modListMode: mode };
      } else {
        config.uiPreferences.modListMode = mode;
      }
    };

    const currentModListMode = computed<ModListMode>(() =>
      configuration.value ? getModListMode(configuration.value) : 'flat',
    );

    const setModListMode = (mode: ModListMode) => {
      if (!configuration.value) return;
      setConfigModListMode(configuration.value, mode);
    };

    const saveConf = async () => {
      const clone = JSON.parse(JSON.stringify(configuration.value));
      await saveConfiguration(clone);
      forceReloadConfig();
      snapshot();
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
      snapshot();
    });

    return {
      saveConf,
      configuration,
      editGothicPath,
      editModsPath,
      isDirty,
      revert,
      currentModListMode,
      setModListMode,
    };
  },
});
</script>
