import type { Mod } from '../../../../interfaces/Mod';
import type { Preset } from '../../../../interfaces/Preset';
import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';
import {
  getAllPresets,
  loadConfiguration,
  loadMods,
  loggerInfo,
  loggerWarn,
  showAlert,
} from '#preload';
import { translate } from '../../../../plugins/i18n';
import type { InstallationState } from '../../../../types/InstallationState';
import { getMessage } from '../../../../utils/messages';
export const useModsStore = defineStore('mods', () => {
  const query = ref('');
  const mods = shallowRef<Mod[]>([]);
  const installedMods = shallowRef<Mod[]>([]);
  const selectedMods = ref<string[]>([]);
  const selectedMod = ref<string>('');
  const categories = shallowRef<string[]>([]);
  const presets = shallowRef<Preset[]>([]);
  const activePreset = ref<string | undefined>();
  const activeCategory = ref<string>('all');
  const installationState = ref<InstallationState>('ready');
  const configExists = ref(false);
  const refreshKey = ref(0);
  const displayedMods = computed<Mod[]>(() => {
    const result = getModsByActiveCategory();
    if (query.value) {
      return result.filter(mod => mod.title.toLowerCase().includes(query.value.toLowerCase()));
    }

    return result;
  });

  function setSelectedMods(mods: string[]) {
    selectedMods.value = mods;
  }

  function setConfigExists(value: boolean) {
    configExists.value = value;
  }

  function incrementRefreshKey() {
    refreshKey.value++;
  }

  function setSelectedMod(mod: string) {
    selectedMod.value = mod;
  }

  function setInstalledMods(mods: Mod[]) {
    installedMods.value = mods;
  }

  function selectPreset(preset: string) {
    selectedMods.value = [];
    activePreset.value = preset;
    const presetMods = presets.value.find(item => item.name === preset)?.modIds || [];

    selectedMods.value = mods.value.filter(mod => presetMods.includes(mod.id)).map(mod => mod.id);

    const missingMods = presetMods.filter(modId => !mods.value.some(mod => mod.id === modId));

    if (missingMods.length > 0) {
      showAlert(
        'modal.warning',
        `${translate('alert.missingModsFromPreset')} ${missingMods.join(', ')}`,
        'warning',
      );
      loggerWarn(`${getMessage('MISSING_MODS_FROM_PRESET')} ${missingMods.join(', ')}`);
    }

    loggerInfo(`${getMessage('PRESET_LOADED', { name: preset })}`);
  }

  function countModsInCategory(category: string) {
    return mods.value.filter(mod => mod.category === category).length;
  }

  function getModsByActiveCategory(): Mod[] {
    if (activeCategory.value === 'installed') {
      return installedMods.value;
    }
    if (activeCategory.value === 'all') {
      return mods.value;
    }

    return mods.value.filter(mod => mod.category === activeCategory.value);
  }

  function displayCategory(category: string) {
    activeCategory.value = category;
  }

  function deactivatePreset() {
    activePreset.value = undefined;
  }

  function setQuery(value: string): void {
    query.value = value;
  }

  function getQuery(): string {
    return query.value;
  }

  function clearQuery(): void {
    query.value = '';
  }

  async function loadInstalledMods() {
    const config = await loadConfiguration();
    if (!config) return;
    activePreset.value = config.preset;
    installedMods.value = mods.value.filter((mod: Mod) => config.installedMods.includes(mod.id));
    selectedMods.value = installedMods.value.map(mod => mod.id);
  }

  async function loadPresets() {
    presets.value = (await getAllPresets()) || [];
  }

  async function reloadMods() {
    mods.value = await loadMods();
    displayCategory('all');
  }

  function loadCategories() {
    categories.value = [
      ...new Set(mods.value.map(mod => mod.category).filter(category => category !== undefined)),
    ];
  }

  function setInstallationState(state: InstallationState) {
    installationState.value = state;
  }

  return {
    mods,
    displayedMods,
    installedMods,
    selectedMods,
    selectedMod,
    categories,
    activeCategory,
    presets,
    activePreset,
    installationState,
    refreshKey,
    configExists,

    setQuery,
    getQuery,
    clearQuery,
    setConfigExists,
    incrementRefreshKey,
    countModsInCategory,
    setSelectedMods,
    setSelectedMod,
    reloadMods,
    loadCategories,
    loadInstalledMods,
    setInstalledMods,
    displayCategory,
    selectPreset,
    loadPresets,
    deactivatePreset,
    setInstallationState,
  };
});
