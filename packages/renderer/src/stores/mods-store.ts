import type { Mod } from '@interfaces/mod';
import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import type { Preset } from '#preload';
import { getAllPresets, loadConfiguration, loadMods } from '#preload';

export const useModsStore = defineStore('mods', () => {
  const mods = shallowRef<Mod[]>([]);
  const displayedMods = shallowRef<Mod[]>([]);
  const installedMods = shallowRef<Mod[]>([]);
  const selectedMods = ref<string[]>([]);
  const categories = shallowRef<string[]>([]);
  const presets = shallowRef<Preset[]>([]);
  const activePreset = ref<string | null>(null);
  const activeCategory = ref<string>('all');

  function setSelectedMods(mods: string[]) {
    selectedMods.value = mods;
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
      alert(`Missing mods from ${preset}:\n ${missingMods.join('\n')}`);
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
    activePreset.value = null;
  }

  async function loadInstalledMods() {
    const config = await loadConfiguration();
    if (!config) return;
    activePreset.value = config.preset;
    installedMods.value = mods.value.filter((mod: Mod) => config.installedMods.includes(mod.id));
    selectedMods.value = installedMods.value.map(mod => mod.id);
  }

  async function loadPresets() {
    const pre = await getAllPresets();
    if (!pre) return;
    presets.value = pre;
  }

  async function reloadMods() {
    mods.value = await loadMods();
    displayedMods.value = mods.value;
  }

  function loadCategories() {
    const categorySet = new Set<string>();
    mods.value.forEach(mod => {
      if (mod.category) {
        categorySet.add(mod.category);
      }
    });
    categories.value = Array.from(categorySet);
  }

  return {
    mods,
    displayedMods,
    installedMods,
    selectedMods,
    categories,
    activeCategory,
    presets,
    activePreset,
    countModsInCategory,
    setSelectedMods,
    reloadMods,
    loadCategories,
    loadInstalledMods,
    setInstalledMods,
    displayCategory,
    selectPreset,
    loadPresets,
    deactivatePreset,
  };
});
