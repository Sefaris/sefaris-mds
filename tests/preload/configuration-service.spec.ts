import { expect, test, vi, beforeEach, describe } from 'vitest';
import {
  isValidConfiguration,
  isGothicPathValid,
  loadConfiguration,
  saveConfiguration,
} from '../../packages/preload/src/services/configuration-service';
import { fs, vol } from 'memfs';
import path from 'path';

vi.mock('path', async () => {
  return await vi.importActual('path');
});

vi.mock('fs', async () => {
  const { fs } = await import('memfs');
  return {
    ...fs,
  };
});

global.alert = vi.fn();

const baseDir = path.resolve();

beforeEach(() => {
  vol.reset();
});

describe('isValidConfiguration', () => {
  test('returns true for valid configuration', () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      installedMods: [],
      filesCreated: [],
    };

    expect(isValidConfiguration(config as never)).toBeTruthy();
  });

  test('returns false for missing modsPath option in json', () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      language: 'pl',
      installedMods: [],
      filesCreated: [],
    };

    expect(isValidConfiguration(config as never)).toBeFalsy();
  });

  test('returns false for non-existent Gothic3.exe', () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3': '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      installedMods: [],
      filesCreated: [],
    };

    expect(isValidConfiguration(config as never)).toBeFalsy();
  });

  test('returns false for incorrect keys in json', () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    const config = {
      gothicePath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      installedMods: [],
      filesCreated: [],
    };

    expect(isValidConfiguration(config as never)).toBeFalsy();
  });

  test('returns false for not supported language', () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'no',
      installedMods: [],
      filesCreated: [],
    };

    expect(isValidConfiguration(config as never)).toBeFalsy();
  });

  test('returns false for installedMods not being array', () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'no',
      installedMods: 'Mod',
      filesCreated: [],
    };

    expect(isValidConfiguration(config as never)).toBeFalsy();
  });

  test('returns false for filesCreated not being array', () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'no',
      installedMods: ['Mod'],
      filesCreated: 'Mod',
    };

    expect(isValidConfiguration(config as never)).toBeFalsy();
  });
});

describe('isGothicPathValid', () => {
  test('returns false for non-existent Gothic3.exe', () => {
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      installedMods: [],
      filesCreated: [],
    };

    expect(isGothicPathValid(config)).toBeFalsy();
  });

  test('returns true for existing Gothic3.exe', () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      installedMods: [],
      filesCreated: [],
    };

    expect(isGothicPathValid(config)).toBeTruthy();
  });
});

describe('loadConfiguration', () => {
  test('reads correct config file', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '{}',
      [path.join(baseDir, 'config.json')]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        modsPath: 'E:\\Games\\Gothic 3\\mods',
        language: 'pl',
        installedMods: [],
        filesCreated: [],
      }),
    });
    await expect(loadConfiguration()).resolves.toBeInstanceOf(Object);
  });

  test('resolves null when config is empty', async () => {
    vol.fromJSON({
      [path.join(baseDir, 'config.json')]: '',
    });
    await expect(loadConfiguration()).rejects.toBeDefined();
  });

  test('resolves null when there is no config file', async () => {
    vol.fromJSON({
      [baseDir]: '',
    });
    await expect(loadConfiguration()).resolves.toBeNull();
  });
});

describe('saveConfiguration', () => {
  test('creates config file with correct data', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
      [baseDir]: '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      installedMods: [],
      filesCreated: [],
    };
    await saveConfiguration(config);
    expect(fs.existsSync(path.join(baseDir, 'config.json'))).toBeTruthy();
  });

  test('doesnt create config for wrong data', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3': '',
      [baseDir]: '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      installedMods: [],
      filesCreated: [],
    };
    await saveConfiguration(config);
    expect(fs.existsSync(path.join(baseDir, 'config.json'))).toBeFalsy();
  });
});
