import type { Mod } from '@interfaces/mod';
import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';
import { loadConfiguration, loadMods } from '#preload';

export const useModsStore = defineStore('mods', () => {
  const mods = shallowRef<Mod[]>([]);
  const displayedMods = shallowRef<Mod[]>([]);
  const installedMods = shallowRef<Mod[]>([]);
  const selectedMods = ref<string[]>([]);
  const categories = shallowRef<string[]>([]);
  const activeCategory = ref<string>('all');
  const countModsInCategory = computed((category:string)=>mods.value.filter(mod => mod.category === category).length);
 
  function setSelectedMods(mods: string[]) {
    selectedMods.value = mods;
  }

  function setInstalledMods(mods: Mod[]) {
    installedMods.value = mods;
  }


  function displayCategory(category:string){
    activeCategory.value=category;
    if(category==='all') {
      displayAllMods();
      return;
    }
    if(category==='installed') {
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
  function loadCategories(){
    const categorySet = new Set<string>();
    mods.value.forEach(mod => {
      if(mod.category){
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
    countModsInCategory,
    setSelectedMods,
    reloadMods,
    loadCategories,
    loadInstalledMods,
    setInstalledMods,
    displayCategory,
  };
});
