import type { Mod } from '../../../../interfaces/Mod';
import type { Preset } from '../../../../interfaces/Preset';
import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import { getAllPresets, loadConfiguration, loadMods } from '#preload';
import { translate } from '../../../../plugins/i18n';
import type { InstallationState } from '../../../../types/InstallationState';
export const useModsStore = defineStore('mods', () => {
  const mods = shallowRef<Mod[]>([]);
  const displayedMods = shallowRef<Mod[]>([]);
  const installedMods = shallowRef<Mod[]>([]);
  const selectedMods = ref<string[]>([]);
  const selectedMod = ref<string>('');
  const categories = shallowRef<string[]>([]);
  const presets = shallowRef<Preset[]>([]);
  const activePreset = ref<string | undefined>();
  const activeCategory = ref<string>('all');
  const installationState = ref<InstallationState>('ready');

  function setSelectedMods(mods: string[]) {
    selectedMods.value = mods;
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
      alert(`${translate('alert.missingModsFromPreset')} ${missingMods.join('\n')}`);
    } else {
      console.log('All mods from preset are available.');
    }
  }

  function countModsInCategory(category: string) {
    return mods.value.filter(mod => mod.category === category).length;
  }

  function displayCategory(category: string) {
    activeCategory.value = category;
    if (category === 'all') {
      displayAllMods();
      return;
    }
    if (category === 'installed') {
      displayInstalledMods();
      return;
    }
    displayedMods.value = mods.value.filter(mod => mod.category === category);
  }

  function displayInstalledMods() {
    displayedMods.value = installedMods.value;
  }

  function displayAllMods() {
    displayedMods.value = mods.value;
  }

  function deactivatePreset() {
    activePreset.value = undefined;
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
    displayedMods.value = mods.value;
  }

  function loadCategories() {
    categories.value = [...new Set(mods.value.map(mod => mod.category))];
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
