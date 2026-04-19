// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import type { AppConfiguration } from '../../../interfaces/AppConfiguration';
import { ConfigurationError } from '../../../Errors/ConfigurationError';
import { getMessage } from '../../../utils/messages';

const preload = vi.hoisted(() => ({
  loadConfiguration: vi.fn(),
  loadConfigurationRaw: vi.fn(),
  selectGameFolder: vi.fn(),
  closeApplication: vi.fn(),
  saveConfiguration: vi.fn(),
  loggerError: vi.fn(),
  loggerInfo: vi.fn(),
  loggerWarn: vi.fn(),
  showAlert: vi.fn(),
  getAlreadyInstalledFiles: vi.fn(),
  loadMods: vi.fn(),
  getAllPresets: vi.fn(),
}));

vi.mock('#preload', () => preload);

// The mods store pulls many things in via `#preload` plus additional stores;
// the bootstrap-flow tests don't exercise its behaviour, so stub it.
vi.mock('../../../packages/renderer/src/stores/mods-store', () => {
  const noop = vi.fn();
  const asyncNoop = vi.fn().mockResolvedValue(undefined);
  return {
    useModsStore: () => ({
      setConfigExists: noop,
      setModListMode: noop,
      reloadMods: asyncNoop,
      loadInstalledMods: asyncNoop,
      loadCategories: noop,
      loadPresets: asyncNoop,
      incrementRefreshKey: noop,
      setSelectedMod: noop,
    }),
  };
});

vi.mock('../../../plugins/i18n', () => ({
  translate: (key: string) => key,
  i18n: { global: { locale: { value: 'pl' } } },
}));

// Stub heavy child views — they pull in many sub-components and stores not
// relevant to the bootstrap-flow tests we want to write here.
vi.mock('../../../packages/renderer/src/components/NavBar.vue', () => ({
  default: { name: 'NavBar', template: '<div />' },
}));
vi.mock('../../../packages/renderer/src/components/MainSection.vue', () => ({
  default: { name: 'MainSection', template: '<div />' },
}));
vi.mock('../../../packages/renderer/src/components/FooterSection.vue', () => ({
  default: { name: 'FooterSection', template: '<div />' },
}));

import HomeView from '../../../packages/renderer/src/views/HomeView.vue';

const mountHome = () =>
  mount(HomeView, {
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        ConfirmModal: {
          name: 'ConfirmModal',
          props: ['isVisible', 'type', 'title', 'message', 'confirmLabel', 'cancelLabel'],
          emits: ['confirm', 'cancel'],
          template:
            '<div :data-visible="isVisible" :data-title="title">' +
            '<button class="confirm" @click="$emit(\'confirm\')">c</button>' +
            '<button class="cancel" @click="$emit(\'cancel\')">x</button>' +
            '</div>',
        },
      },
    },
  });

beforeEach(() => {
  setActivePinia(createPinia());
  Object.values(preload).forEach(fn => fn.mockReset());
  preload.getAlreadyInstalledFiles.mockResolvedValue([]);
  preload.saveConfiguration.mockResolvedValue(undefined);
});

describe('HomeView bootstrap flow', () => {
  it('shows the missing-configuration modal when no config exists', async () => {
    preload.loadConfiguration.mockRejectedValue(
      new ConfigurationError(getMessage('MISSING_CONFIGURATION')),
    );

    const wrapper = mountHome();
    await flushPromises();

    const modals = wrapper.findAllComponents({ name: 'ConfirmModal' });
    const noConfig = modals.find(m => m.props('title') === 'alert.configNotFoundTitle');
    expect(noConfig).toBeDefined();
    expect(noConfig!.props('isVisible')).toBe(true);
    expect(preload.loggerError).toHaveBeenCalledWith(getMessage('CONFIG_NOT_FOUND'));
    expect(preload.loggerInfo).toHaveBeenCalledWith(getMessage('BOOTSTRAP_NO_CONFIG_MODAL_SHOWN'));
    // Native dialog must NOT be opened automatically anymore.
    expect(preload.selectGameFolder).not.toHaveBeenCalled();
  });

  it('keeps the modal open and does not close the app when user cancels the picker', async () => {
    preload.loadConfiguration.mockRejectedValue(
      new ConfigurationError(getMessage('MISSING_CONFIGURATION')),
    );
    preload.selectGameFolder.mockResolvedValue('');

    const wrapper = mountHome();
    await flushPromises();

    const modals = wrapper.findAllComponents({ name: 'ConfirmModal' });
    const noConfig = modals.find(m => m.props('title') === 'alert.configNotFoundTitle')!;
    await noConfig.find('button.confirm').trigger('click');
    await flushPromises();

    expect(preload.selectGameFolder).toHaveBeenCalledOnce();
    expect(preload.saveConfiguration).not.toHaveBeenCalled();
    expect(preload.closeApplication).not.toHaveBeenCalled();
    expect(noConfig.props('isVisible')).toBe(true);
  });

  it('saves a fresh configuration when user picks a folder', async () => {
    preload.loadConfiguration.mockRejectedValue(
      new ConfigurationError(getMessage('MISSING_CONFIGURATION')),
    );
    preload.selectGameFolder.mockResolvedValue('C:/Games/Gothic 3');

    const wrapper = mountHome();
    await flushPromises();

    const noConfig = wrapper
      .findAllComponents({ name: 'ConfirmModal' })
      .find(m => m.props('title') === 'alert.configNotFoundTitle')!;
    await noConfig.find('button.confirm').trigger('click');
    await flushPromises();

    expect(preload.saveConfiguration).toHaveBeenCalledOnce();
    const saved = preload.saveConfiguration.mock.calls[0][0] as AppConfiguration;
    expect(saved.gothicPath).toBe('C:/Games/Gothic 3');
    expect(saved.installedMods).toEqual([]);
    expect(saved.filesCreated).toEqual([]);
    expect(noConfig.props('isVisible')).toBe(false);
  });

  it('closes the application when user cancels the missing-config modal', async () => {
    preload.loadConfiguration.mockRejectedValue(
      new ConfigurationError(getMessage('MISSING_CONFIGURATION')),
    );

    const wrapper = mountHome();
    await flushPromises();

    const noConfig = wrapper
      .findAllComponents({ name: 'ConfirmModal' })
      .find(m => m.props('title') === 'alert.configNotFoundTitle')!;
    await noConfig.find('button.cancel').trigger('click');

    expect(preload.closeApplication).toHaveBeenCalledOnce();
  });

  it('still shows the missing-config modal when the logger throws', async () => {
    preload.loadConfiguration.mockRejectedValue(
      new ConfigurationError(getMessage('MISSING_CONFIGURATION')),
    );
    preload.loggerError.mockImplementation(() => {
      throw new Error('logger not ready');
    });

    const wrapper = mountHome();
    await flushPromises();

    const noConfig = wrapper
      .findAllComponents({ name: 'ConfirmModal' })
      .find(m => m.props('title') === 'alert.configNotFoundTitle')!;
    expect(noConfig.props('isVisible')).toBe(true);
  });
});
