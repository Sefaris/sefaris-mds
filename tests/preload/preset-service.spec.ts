import { expect, test, vi, beforeEach, describe } from 'vitest';
import { vol } from 'memfs';
import { getAllPresets, isPresetValid } from '../../packages/preload/src/services/preset-service';
import path from 'path';
import { afterEach } from 'node:test';
let config;

function mockConfig(missing?: boolean) {
  config = {
    gothicPath: 'E:\\Games\\Gothic 3',
    modsPath: 'E:\\Games\\Gothic 3\\mods',
    language: 'pl',
    ignoreDependencies: false,
    ignoreIncompatible: false,
    installedMods: [],
    filesCreated: [],
  };
  if (missing) config = null;
  vi.mock('../../packages/preload/src/services/configuration-service', () => {
    return {
      loadConfiguration: vi.fn(() => Promise.resolve(config)),
    };
  });
}

beforeEach(() => {
  vi.mock('path', async () => {
    return await vi.importActual('path');
  });

  vi.mock('fs', async () => {
    const { fs } = await import('memfs');
    return {
      ...fs,
    };
  });
  vol.reset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('getAllPresets', () => {
  beforeEach(() => {
    mockConfig();
  });
  test('returns 3 presets', async () => {
    const smartPreset = {
      name: 'Smart Mod Pack',
      modIds: ['CM Rebalance'],
    };
    const UltimatePreset = {
      name: 'Ultimate Mod Pack',
      modIds: ['Refresh Trade Generated', 'Quick Loot'],
    };
    const ZlidenPreset = {
      name: 'Zliden Mod Pack',
      modIds: ['CM Rebalance', 'Balance Ultimate'],
    };
    vol.fromJSON(
      {
        'Smart Mod Pack\\preset.json': JSON.stringify(smartPreset),
        'Ultimate Mod Pack\\preset.json': JSON.stringify(UltimatePreset),
        'Zliden Mod Pack\\preset.json': JSON.stringify(ZlidenPreset),
      },
      path.join('E:', 'Games', 'Gothic 3', 'presets'),
    );
    await expect(getAllPresets()).resolves.toHaveLength(3);
  });

  test('returns empty array for preset with no mods', async () => {
    const smartPreset = {
      name: 'Smart Mod Pack',
      modIds: [],
    };
    vol.fromJSON(
      {
        'Smart Mod Pack\\preset.json': JSON.stringify(smartPreset),
      },
      path.join('E:', 'Games', 'Gothic 3', 'presets'),
    );

    await expect(getAllPresets()).resolves.toHaveLength(0);
  });

  test('rejects and throw error for missing config', async () => {
    mockConfig(true);

    const smartPreset = {
      name: 'Smart Mod Pack',
      modIds: ['CM Rebalance'],
    };

    vol.fromJSON(
      {
        'Smart Mod Pack\\preset.json': JSON.stringify(smartPreset),
      },
      path.join('E:', 'Games', 'Gothic 3', 'presets'),
    );

    await expect(getAllPresets()).rejects.toThrowError();
  });

  test('rejects and throw error for empty preset file', async () => {
    vol.fromJSON(
      {
        'Smart Mod Pack\\preset.json': '',
        'Ultimate Mod Pack': '',
        'Zliden Mod Pack': '',
      },
      path.join('E:', 'Games', 'Gothic 3', 'presets'),
    );
    const result = getAllPresets();
    await expect(result).rejects.toThrowError();
    await expect(result).rejects.toBeDefined();
  });
});

describe('isPresetValid', () => {
  test('returns true for correct preset', () => {
    const smartPreset = {
      name: 'Smart Mod Pack',
      modIds: ['CM Rebalance'],
    };
    expect(isPresetValid(smartPreset)).toBeTruthy();
  });

  test('returns false for preset with no mods', () => {
    const smartPreset = {
      name: 'Smart Mod Pack',
      modIds: [],
    };
    expect(isPresetValid(smartPreset)).toBeFalsy();
  });

  test('returns false for incorrect json structure', () => {
    const smartPreset = {
      nadme: 'Smart Mod Pack',
      modIds: ['CM Rebalance', 'Main'],
    };
    expect(isPresetValid(smartPreset as never)).toBeFalsy();
  });
});
