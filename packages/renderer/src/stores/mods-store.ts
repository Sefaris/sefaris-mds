import type { Mod } from '../../../../interfaces/Mod';
import type { ModListMode } from '../../../../interfaces/AppConfiguration';
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
import { includesModId, isSameModId } from '../../../../utils/mod-id';
export const useModsStore = defineStore('mods', () => {
  const query = ref('');
  const mods = shallowRef<Mod[]>([]);
  const installedMods = shallowRef<Mod[]>([]);
  const selectedMods = ref<string[]>([]);
  const selectedMod = ref<string>('');
  const categories = shallowRef<string[]>([]);
  const presets = shallowRef<Preset[]>([]);
  const activePreset = ref<string | undefined>();
  const basePreset = ref<string | undefined>();
  const installedPreset = ref<string | undefined>();
  const activeCategory = ref<string>('all');
  const installationState = ref<InstallationState>('ready');
  const configExists = ref(false);
  const refreshKey = ref(0);
  const modListMode = ref<ModListMode>('flat');
  const expandedCategories = ref<Set<string>>(new Set());
  const displayedMods = computed<Mod[]>(() => {
    const result = getModsByActiveCategory();
    if (query.value) {
      return result.filter(mod => mod.title.toLowerCase().includes(query.value.toLowerCase()));
    }

    return result;
  });

  /**
   * Mods grouped by category for the `grouped` list mode.
   * Respects only grouped-relevant filters:
   * - `activeCategory === 'installed'` => installed mods only
   * - otherwise => all mods
   * and applies `query` over the selected source.
   * Returned object iterates categories alphabetically (locale-aware, case-insensitive).
   * Mods without a `category` are bucketed under `'Uncategorized'`.
   */
  const groupedMods = computed<Record<string, Mod[]>>(() => {
    const byFilter = activeCategory.value === 'installed' ? installedMods.value : mods.value;
    const source = query.value
      ? byFilter.filter(mod => mod.title.toLowerCase().includes(query.value.toLowerCase()))
      : byFilter;

    const groups = new Map<string, Mod[]>();
    for (const mod of source) {
      const key = mod.category || 'Uncategorized';
      const bucket = groups.get(key);
      if (bucket) {
        bucket.push(mod);
      } else {
        groups.set(key, [mod]);
      }
    }

    const sortedKeys = Array.from(groups.keys()).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    );

    const result: Record<string, Mod[]> = {};
    for (const key of sortedKeys) {
      result[key] = groups.get(key)!;
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
    basePreset.value = preset;
    const presetMods = presets.value.find(item => item.name === preset)?.modIds || [];

    selectedMods.value = mods.value
      .filter(mod => includesModId(presetMods, mod.id))
      .map(mod => mod.id);

    const missingMods = presetMods.filter(
      modId => !mods.value.some(mod => isSameModId(mod.id, modId)),
    );

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
    basePreset.value = config.preset;
    installedPreset.value = config.preset;
    installedMods.value = mods.value.filter((mod: Mod) =>
      includesModId(config.installedMods, mod.id),
    );
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
    // Reset expanded state so every visible group starts expanded after each (re)load.
    expandedCategories.value = new Set(mods.value.map(mod => mod.category || 'Uncategorized'));
  }

  function setInstallationState(state: InstallationState) {
    installationState.value = state;
  }

  function setModListMode(mode: ModListMode) {
    modListMode.value = mode;
    if (
      mode === 'grouped' &&
      activeCategory.value !== 'all' &&
      activeCategory.value !== 'installed'
    ) {
      activeCategory.value = 'all';
    }
  }

  function isCategoryExpanded(name: string): boolean {
    return expandedCategories.value.has(name);
  }

  function toggleCategoryExpanded(name: string) {
    const next = new Set(expandedCategories.value);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    expandedCategories.value = next;
  }

  function expandAllCategories() {
    expandedCategories.value = new Set(Object.keys(groupedMods.value));
  }

  function collapseAllCategories() {
    expandedCategories.value = new Set();
  }

  return {
    mods,
    displayedMods,
    groupedMods,
    installedMods,
    selectedMods,
    selectedMod,
    categories,
    activeCategory,
    presets,
    activePreset,
    basePreset,
    installedPreset,
    installationState,
    refreshKey,
    configExists,
    modListMode,
    expandedCategories,

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
    setModListMode,
    isCategoryExpanded,
    toggleCategoryExpanded,
    expandAllCategories,
    collapseAllCategories,
  };
});
