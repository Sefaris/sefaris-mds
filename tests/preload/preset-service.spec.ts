import { expect, test, vi, beforeEach, describe } from 'vitest';
import { vol, fs } from 'memfs';
import { getAllPresets, isPresetValid, savePreset, getPresetFiles, loadPreset } from '../../packages/preload/src/services/preset-service';
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

  vi.mock('../../packages/preload/src/services/logger-service', () => {
    return {
      loggerInfo: vi.fn(),
      loggerError: vi.fn(),
      loggerWarn: vi.fn(),
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

  test('returns true for preset with inheritsFrom', () => {
    const preset = {
      name: 'Child Preset',
      modIds: ['Mod1'],
      inheritsFrom: 'Parent Preset',
    };
    expect(isPresetValid(preset)).toBeTruthy();
  });

  test('returns false for preset with non-string inheritsFrom', () => {
    const preset = {
      name: 'Child Preset',
      modIds: ['Mod1'],
      inheritsFrom: 123,
    };
    expect(isPresetValid(preset as never)).toBeFalsy();
  });
});

describe('savePreset', () => {
  beforeEach(() => {
    mockConfig();
    vol.fromJSON(
      {
        'presets\\placeholder': '',
      },
      'E:\\Games\\Gothic 3',
    );
  });

  test('saves preset without inheritance', async () => {
    await savePreset(['Mod1', 'Mod2'], 'TestPreset');
    const jsonPath = path.join('E:', 'Games', 'Gothic 3', 'presets', 'TestPreset', 'preset.json');
    const saved = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    expect(saved.name).toBe('TestPreset');
    expect(saved.modIds).toEqual(['Mod1', 'Mod2']);
    expect(saved.inheritsFrom).toBeUndefined();
  });

  test('saves preset with inheritance', async () => {
    await savePreset(['Mod1'], 'ChildPreset', 'ParentPreset');
    const jsonPath = path.join(
      'E:',
      'Games',
      'Gothic 3',
      'presets',
      'ChildPreset',
      'preset.json',
    );
    const saved = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    expect(saved.name).toBe('ChildPreset');
    expect(saved.modIds).toEqual(['Mod1']);
    expect(saved.inheritsFrom).toBe('ParentPreset');
  });

  test('throws for empty mods', async () => {
    await expect(savePreset([], 'TestPreset')).rejects.toThrowError();
  });

  test('throws for empty name', async () => {
    await expect(savePreset(['Mod1'], '')).rejects.toThrowError();
  });
});

describe('getPresetFiles', () => {
  beforeEach(() => {
    mockConfig();
  });

  test('returns config files excluding preset.json', async () => {
    const preset = { name: 'MyPreset', modIds: ['Mod1'] };
    vol.fromJSON(
      {
        'MyPreset\\preset.json': JSON.stringify(preset),
        'MyPreset\\Mod.ini': '',
        'MyPreset\\script.dll': '',
        'MyPreset\\splash.bmp': '',
      },
      path.join('E:', 'Games', 'Gothic 3', 'presets'),
    );
    const files = await getPresetFiles('MyPreset');
    expect(files).toHaveLength(3);
    expect(files).toContain('Mod.ini');
    expect(files).toContain('script.dll');
    expect(files).toContain('splash.bmp');
    expect(files).not.toContain('preset.json');
  });

  test('returns empty array for non-existent preset', async () => {
    vol.fromJSON(
      {
        'presets\\placeholder': '',
      },
      'E:\\Games\\Gothic 3',
    );
    const files = await getPresetFiles('NonExistent');
    expect(files).toHaveLength(0);
  });

  test('returns empty array for preset with only preset.json', async () => {
    const preset = { name: 'EmptyPreset', modIds: ['Mod1'] };
    vol.fromJSON(
      {
        'EmptyPreset\\preset.json': JSON.stringify(preset),
      },
      path.join('E:', 'Games', 'Gothic 3', 'presets'),
    );
    const files = await getPresetFiles('EmptyPreset');
    expect(files).toHaveLength(0);
  });
});

describe('loadPreset', () => {
  beforeEach(() => {
    mockConfig();
  });

  test('loads valid preset', async () => {
    const preset = { name: 'TestPreset', modIds: ['Mod1', 'Mod2'] };
    vol.fromJSON(
      {
        'TestPreset\\preset.json': JSON.stringify(preset),
      },
      path.join('E:', 'Games', 'Gothic 3', 'presets'),
    );
    const result = await loadPreset('TestPreset');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('TestPreset');
    expect(result!.modIds).toEqual(['Mod1', 'Mod2']);
  });

  test('loads preset with inheritsFrom', async () => {
    const preset = {
      name: 'ChildPreset',
      modIds: ['Mod1'],
      inheritsFrom: 'ParentPreset',
    };
    vol.fromJSON(
      {
        'ChildPreset\\preset.json': JSON.stringify(preset),
      },
      path.join('E:', 'Games', 'Gothic 3', 'presets'),
    );
    const result = await loadPreset('ChildPreset');
    expect(result).not.toBeNull();
    expect(result!.inheritsFrom).toBe('ParentPreset');
  });

  test('returns null for non-existent preset', async () => {
    vol.fromJSON(
      {
        'presets\\placeholder': '',
      },
      'E:\\Games\\Gothic 3',
    );
    const result = await loadPreset('NonExistent');
    expect(result).toBeNull();
  });

  test('returns null for invalid preset', async () => {
    const invalidPreset = { name: 'Bad', modIds: [] };
    vol.fromJSON(
      {
        'Bad\\preset.json': JSON.stringify(invalidPreset),
      },
      path.join('E:', 'Games', 'Gothic 3', 'presets'),
    );
    const result = await loadPreset('Bad');
    expect(result).toBeNull();
  });
});

describe('getAllPresets with inheritance', () => {
  beforeEach(() => {
    mockConfig();
  });

  test('loads presets with inheritsFrom field', async () => {
    const parent = { name: 'Parent', modIds: ['Mod1'] };
    const child = { name: 'Child', modIds: ['Mod1', 'Mod2'], inheritsFrom: 'Parent' };
    vol.fromJSON(
      {
        'Parent\\preset.json': JSON.stringify(parent),
        'Child\\preset.json': JSON.stringify(child),
      },
      path.join('E:', 'Games', 'Gothic 3', 'presets'),
    );
    const presets = await getAllPresets();
    expect(presets).toHaveLength(2);
    const childPreset = presets.find(p => p.name === 'Child');
    expect(childPreset?.inheritsFrom).toBe('Parent');
  });
});
