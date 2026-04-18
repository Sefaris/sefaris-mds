// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import type { Mod } from '../../../interfaces/Mod';

vi.mock('#preload', () => ({
  getAllPresets: vi.fn(async () => []),
  loadConfiguration: vi.fn(async () => null),
  loadMods: vi.fn(async () => []),
  loggerInfo: vi.fn(),
  loggerWarn: vi.fn(),
  showAlert: vi.fn(),
}));

vi.mock('../../../plugins/i18n', () => ({
  translate: (key: string) => key,
  i18n: { global: { t: (key: string) => key } },
}));

import { useModsStore } from '../../../packages/renderer/src/stores/mods-store';

const makeMod = (id: string, category: string, title?: string): Mod => ({
  id,
  title: title ?? id,
  category,
  dependencies: [],
  incompatibles: [],
  directoryName: id,
  authors: [],
  path: `/mods/${id}`,
});

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('useModsStore.groupedMods', () => {
  it('groups mods by category', () => {
    const store = useModsStore();
    store.mods = [makeMod('a1', 'Quests'), makeMod('a2', 'Quests'), makeMod('b1', 'Graphics')];

    const grouped = store.groupedMods;
    expect(Object.keys(grouped)).toEqual(['Graphics', 'Quests']);
    expect(grouped.Quests.map(m => m.id)).toEqual(['a1', 'a2']);
    expect(grouped.Graphics.map(m => m.id)).toEqual(['b1']);
  });

  it('sorts categories alphabetically (case-insensitive)', () => {
    const store = useModsStore();
    store.mods = [makeMod('m1', 'zeta'), makeMod('m2', 'Alpha'), makeMod('m3', 'beta')];

    expect(Object.keys(store.groupedMods)).toEqual(['Alpha', 'beta', 'zeta']);
  });

  it('returns an empty object when there are no mods', () => {
    const store = useModsStore();
    store.mods = [];
    expect(store.groupedMods).toEqual({});
  });

  it('filters by query (title, case-insensitive) and keeps grouping across categories', () => {
    const store = useModsStore();
    store.mods = [
      makeMod('a1', 'Quests', 'Dragon Hunter'),
      makeMod('a2', 'Quests', 'Easy Loot'),
      makeMod('b1', 'Graphics', 'HD Dragons'),
    ];
    store.setQuery('dragon');

    const grouped = store.groupedMods;
    expect(Object.keys(grouped)).toEqual(['Graphics', 'Quests']);
    expect(grouped.Quests.map(m => m.id)).toEqual(['a1']);
    expect(grouped.Graphics.map(m => m.id)).toEqual(['b1']);
  });

  it('uses installed mods as source when activeCategory is installed', () => {
    const store = useModsStore();
    store.mods = [
      makeMod('a1', 'Quests', 'Dragon Hunter'),
      makeMod('b1', 'Graphics', 'HD Dragons'),
      makeMod('c1', 'Quests', 'Easy Loot'),
    ];
    store.installedMods = [makeMod('b1', 'Graphics', 'HD Dragons')];

    store.displayCategory('installed');

    const grouped = store.groupedMods;
    expect(Object.keys(grouped)).toEqual(['Graphics']);
    expect(grouped.Graphics.map(m => m.id)).toEqual(['b1']);
  });

  it('drops categories whose mods are filtered out by query', () => {
    const store = useModsStore();
    store.mods = [
      makeMod('a1', 'Quests', 'Dragon Hunter'),
      makeMod('b1', 'Graphics', 'Sky Tweaks'),
    ];
    store.setQuery('dragon');

    expect(Object.keys(store.groupedMods)).toEqual(['Quests']);
  });

  it('buckets mods without a category under "Uncategorized"', () => {
    const store = useModsStore();
    store.mods = [makeMod('a1', ''), makeMod('b1', 'Quests')];

    const grouped = store.groupedMods;
    expect(Object.keys(grouped)).toEqual(['Quests', 'Uncategorized']);
    expect(grouped.Uncategorized.map(m => m.id)).toEqual(['a1']);
  });
});

describe('useModsStore.toggleCategoryExpanded', () => {
  it('removes an expanded category from the set', () => {
    const store = useModsStore();
    store.mods = [makeMod('a', 'Quests'), makeMod('b', 'Graphics')];
    store.loadCategories();
    expect(store.isCategoryExpanded('Quests')).toBe(true);

    store.toggleCategoryExpanded('Quests');

    expect(store.isCategoryExpanded('Quests')).toBe(false);
    expect(store.isCategoryExpanded('Graphics')).toBe(true);
  });

  it('re-adds a collapsed category on a second toggle', () => {
    const store = useModsStore();
    store.mods = [makeMod('a', 'Quests')];
    store.loadCategories();

    store.toggleCategoryExpanded('Quests');
    store.toggleCategoryExpanded('Quests');

    expect(store.isCategoryExpanded('Quests')).toBe(true);
  });

  it('expands an unknown category when toggled (defensive)', () => {
    const store = useModsStore();
    store.toggleCategoryExpanded('Brand new');
    expect(store.isCategoryExpanded('Brand new')).toBe(true);
  });
});

describe('useModsStore.expand/collapse all categories', () => {
  it('expands all currently grouped categories', () => {
    const store = useModsStore();
    store.mods = [makeMod('a', 'Quests'), makeMod('b', 'Graphics')];
    store.loadCategories();
    store.collapseAllCategories();

    store.expandAllCategories();

    expect(store.isCategoryExpanded('Quests')).toBe(true);
    expect(store.isCategoryExpanded('Graphics')).toBe(true);
  });

  it('collapses all categories', () => {
    const store = useModsStore();
    store.mods = [makeMod('a', 'Quests'), makeMod('b', 'Graphics')];
    store.loadCategories();

    store.collapseAllCategories();

    expect(store.isCategoryExpanded('Quests')).toBe(false);
    expect(store.isCategoryExpanded('Graphics')).toBe(false);
  });
});

describe('useModsStore.loadCategories', () => {
  it('initializes expandedCategories to all known categories', () => {
    const store = useModsStore();
    store.mods = [makeMod('a', 'Quests'), makeMod('b', 'Graphics'), makeMod('c', 'Quests')];

    store.loadCategories();

    expect(store.categories).toEqual(['Quests', 'Graphics']);
    expect(store.isCategoryExpanded('Quests')).toBe(true);
    expect(store.isCategoryExpanded('Graphics')).toBe(true);
  });

  it('resets expanded state on each call', () => {
    const store = useModsStore();
    store.mods = [makeMod('a', 'Quests')];
    store.loadCategories();
    store.toggleCategoryExpanded('Quests');
    expect(store.isCategoryExpanded('Quests')).toBe(false);

    store.loadCategories();

    expect(store.isCategoryExpanded('Quests')).toBe(true);
  });
});

describe('useModsStore.setModListMode', () => {
  it('defaults to "flat"', () => {
    const store = useModsStore();
    expect(store.modListMode).toBe('flat');
  });

  it('switches to grouped', () => {
    const store = useModsStore();
    store.setModListMode('grouped');
    expect(store.modListMode).toBe('grouped');
  });

  it('resets non-global activeCategory to all when switching to grouped', () => {
    const store = useModsStore();
    store.displayCategory('Quests');

    store.setModListMode('grouped');

    expect(store.activeCategory).toBe('all');
  });
});
