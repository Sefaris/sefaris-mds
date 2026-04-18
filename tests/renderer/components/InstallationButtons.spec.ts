// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import type { Mod } from '../../../interfaces/Mod';

const preload = vi.hoisted(() => ({
  deleteMods: vi.fn(),
  installMods: vi.fn(),
  loggerError: vi.fn(),
  loggerInfo: vi.fn(),
  showAlert: vi.fn(),
  showNotification: vi.fn(),
}));

vi.mock('#preload', () => preload);

vi.mock('../../../plugins/i18n', () => ({
  translate: (key: string) => key,
  i18n: { global: { locale: { value: 'pl' } } },
}));

import InstallationButtons from '../../../packages/renderer/src/components/InstallationButtons.vue';
import { useModsStore } from '../../../packages/renderer/src/stores/mods-store';

const makeMod = (id: string): Mod => ({
  id,
  title: id,
  category: 'General',
  dependencies: [],
  incompatibles: [],
  directoryName: id,
  authors: [],
  path: `/mods/${id}`,
});

const mountComponent = () =>
  mount(InstallationButtons, {
    global: {
      mocks: {
        $t: (key: string) => key,
      },
    },
  });

beforeEach(() => {
  setActivePinia(createPinia());

  preload.deleteMods.mockReset();
  preload.installMods.mockReset();
  preload.loggerError.mockReset();
  preload.loggerInfo.mockReset();
  preload.showAlert.mockReset();
  preload.showNotification.mockReset();

  preload.deleteMods.mockResolvedValue(undefined);
  preload.installMods.mockResolvedValue(1);
});

describe('InstallationButtons', () => {
  it('does not render delete action when there are no selected and no installed mods', () => {
    const store = useModsStore();
    store.mods = [makeMod('mod-1')];
    store.selectedMods = [];
    store.installedMods = [];

    const wrapper = mountComponent();

    expect(wrapper.text()).not.toContain('action.delete');
    expect(wrapper.find('button.bg-install').exists()).toBe(false);
  });

  it('renders delete action when there are installed mods and nothing selected', () => {
    const store = useModsStore();
    store.mods = [makeMod('mod-1')];
    store.selectedMods = [];
    store.installedMods = [makeMod('mod-1')];

    const wrapper = mountComponent();

    expect(wrapper.text()).toContain('action.delete');
    expect(wrapper.find('button.bg-install').exists()).toBe(true);
  });

  it('clears active and base preset after successful deletion', async () => {
    const store = useModsStore();
    store.mods = [makeMod('mod-1')];
    store.selectedMods = [];
    store.installedMods = [makeMod('mod-1')];
    store.activePreset = 'Starter';
    store.basePreset = 'Starter';
    store.installedPreset = 'Starter';
    store.installationState = 'edit';

    const wrapper = mountComponent();
    await wrapper.find('button.bg-install').trigger('click');
    await flushPromises();

    expect(preload.deleteMods).toHaveBeenCalledTimes(1);
    expect(store.installedMods).toEqual([]);
    expect(store.activePreset).toBeUndefined();
    expect(store.basePreset).toBeUndefined();
    expect(store.installedPreset).toBeUndefined();
    expect(store.installationState).toBe('ready');
  });
});
