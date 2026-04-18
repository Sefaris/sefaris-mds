// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
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

// Avoid resolving ModItem.vue (it imports a renderer-only `/@/` alias not
// available in the test environment). The smoke test stubs it out anyway.
vi.mock('../../../packages/renderer/src/components/ModItem.vue', () => ({
  default: {
    name: 'ModItem',
    props: ['mod', 'config'],
    template: '<div class="mod-item-stub">{{ mod.id }}</div>',
  },
}));
vi.mock('../../../packages/renderer/src/components/NoMods.vue', () => ({
  default: { name: 'NoMods', template: '<div class="no-mods-stub" />' },
}));

import GroupedModList from '../../../packages/renderer/src/components/GroupedModList.vue';
import { useModsStore } from '../../../packages/renderer/src/stores/mods-store';

const makeMod = (id: string, category: string): Mod => ({
  id,
  title: id,
  category,
  dependencies: [],
  incompatibles: [],
  directoryName: id,
  authors: [],
  path: `/mods/${id}`,
});

const mountComponent = () =>
  mount(GroupedModList, {
    props: { config: {} as unknown as object },
    global: {
      mocks: {
        $t: (key: string) => key,
      },
    },
  });

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('GroupedModList', () => {
  it('renders the empty state when there are no mods', () => {
    useModsStore();
    const wrapper = mountComponent();
    expect(wrapper.find('.no-mods-stub').exists()).toBe(true);
  });

  it('renders a section header per category with its mod count', () => {
    const store = useModsStore();
    store.mods = [makeMod('a1', 'Quests'), makeMod('a2', 'Quests'), makeMod('b1', 'Graphics')];
    store.loadCategories();

    const wrapper = mountComponent();
    const headers = wrapper.findAll('button[aria-expanded]');
    expect(headers).toHaveLength(2);
    expect(headers[0].text()).toContain('Graphics');
    expect(headers[0].text()).toContain('(1)');
    expect(headers[1].text()).toContain('Quests');
    expect(headers[1].text()).toContain('(2)');
  });

  it('hides mods of a section when its header is clicked', async () => {
    const store = useModsStore();
    store.mods = [makeMod('a1', 'Quests'), makeMod('b1', 'Graphics')];
    store.loadCategories();

    const wrapper = mountComponent();
    expect(wrapper.findAll('.mod-item-stub')).toHaveLength(2);

    const questsHeader = wrapper.findAll('button[aria-expanded]')[1];
    await questsHeader.trigger('click');

    expect(wrapper.findAll('.mod-item-stub')).toHaveLength(1);
    expect(store.isCategoryExpanded('Quests')).toBe(false);
  });
});
