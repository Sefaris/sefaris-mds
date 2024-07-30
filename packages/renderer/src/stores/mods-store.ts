import type { Mod } from '@interfaces/mod';
import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import { loadConfiguration, loadMods } from '#preload';

export const useModsStore = defineStore('mods', () => {
  const mods = shallowRef<Mod[]>([]);
  const displayedMods = shallowRef<Mod[]>([]);
  const installedMods = shallowRef<Mod[]>([]);
  const selectedMods = ref<string[]>([]);

  function setSelectedMods(mods: string[]) {
    selectedMods.value = mods;
  }

  function setInstalledMods(mods: Mod[]) {
    installedMods.value = mods;
  }

  function displayInstalledMods() {
    displayedMods.value = installedMods.value;
  }

  function displayAllMods() {
    displayedMods.value = mods.value;
  }

  async function loadInstalledMods() {
    const config = await loadConfiguration();
    if (!config) return;
    installedMods.value = mods.value.filter((mod: Mod) => config.installedMods.includes(mod.id));
    selectedMods.value = installedMods.value.map(mod => mod.id);
  }

  async function reloadMods() {
    mods.value = await loadMods();
    displayedMods.value = mods.value;
  }

  return {
    mods,
    displayedMods,
    installedMods,
    selectedMods,
    setSelectedMods,
    reloadMods,
    loadInstalledMods,
    displayInstalledMods,
    displayAllMods,
    setInstalledMods,
  };
});
