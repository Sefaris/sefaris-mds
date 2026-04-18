import { expect, test, vi, beforeEach, describe, afterEach } from 'vitest';
import {
  isValidConfiguration,
  isGothicPathValid,
  loadConfiguration,
  saveConfiguration,
} from '../../packages/preload/src/services/configuration-service';
import { fs, vol } from 'memfs';
import path from 'path';
import { CONFIG_FILE } from '../../utils/constants';

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

  vi.mock('../../packages/preload/src/services/alert-service', async () => ({
    showAlert: vi.fn(),
  }));
  vi.mock('../../packages/preload/src/services/file-service', async () => {
    return {
      ...(await vi.importActual('../../packages/preload/src/services/file-service'))!,
      getDocumentsPath: vi.fn(() => Promise.resolve('\\user\\documents')),
    };
  });

  vi.mock('../../packages/preload/src/services/logger-service', () => {
    return {
      loggerInfo: vi.fn(),
      loggerError: vi.fn(),
      loggerWarn: vi.fn(),
    };
  });

  vol.reset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('isValidConfiguration', () => {
  test('returns true for valid configuration', () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      ignoreDependencies: false,
      ignoreIncompatible: false,
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
      ignoreDependencies: false,
      ignoreIncompatible: false,
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
      ignoreDependencies: false,
      ignoreIncompatible: false,
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
      ignoreDependencies: false,
      ignoreIncompatible: false,
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
      ignoreDependencies: false,
      ignoreIncompatible: false,
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
      ignoreDependencies: false,
      ignoreIncompatible: false,
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
      ignoreDependencies: false,
      ignoreIncompatible: false,
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
      ignoreDependencies: false,
      ignoreIncompatible: false,
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
      ignoreDependencies: false,
      ignoreIncompatible: false,
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
      [path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json')]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        modsPath: 'E:\\Games\\Gothic 3\\mods',
        language: 'pl',
        ignoreDependencies: false,
        ignoreIncompatible: false,
        installedMods: [],
        filesCreated: [],
      }),
    });
    await expect(loadConfiguration()).resolves.toBeInstanceOf(Object);
  });

  test('rejects and throw error when config is empty', async () => {
    vol.fromJSON({
      [path.join('user', 'documents', 'gothic3', 'StarterConfig.json')]: '',
    });
    await expect(loadConfiguration()).rejects.toBeDefined();
    await expect(loadConfiguration()).rejects.toThrowError();
  });

  test('migrates absolute filesCreated entries inside gothicPath to relative', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
      [path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json')]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        modsPath: 'E:\\Games\\Gothic 3\\mods',
        language: 'pl',
        ignoreDependencies: false,
        ignoreIncompatible: false,
        installedMods: [],
        filesCreated: [
          'E:\\Games\\Gothic 3\\Data\\gui.mod',
          'E:\\Games\\Gothic 3\\ini\\eCDELocator.ini',
        ],
      }),
    });

    const config = await loadConfiguration();
    expect(config?.filesCreated).toEqual(['Data/gui.mod', 'ini/eCDELocator.ini']);
  });

  test('drops absolute filesCreated entries outside gothicPath', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
      [path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json')]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        modsPath: 'E:\\Games\\Gothic 3\\mods',
        language: 'pl',
        ignoreDependencies: false,
        ignoreIncompatible: false,
        installedMods: [],
        filesCreated: [
          'E:\\Games\\Gothic 3\\Data\\gui.mod',
          'D:\\OldGothic\\Data\\stale.mod',
          'C:\\elsewhere\\file.mod',
        ],
      }),
    });

    const config = await loadConfiguration();
    expect(config?.filesCreated).toEqual(['Data/gui.mod']);
  });

  test('keeps already relative filesCreated entries and normalizes separators', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
      [path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json')]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        modsPath: 'E:\\Games\\Gothic 3\\mods',
        language: 'pl',
        ignoreDependencies: false,
        ignoreIncompatible: false,
        installedMods: [],
        filesCreated: ['Data/gui.mod', 'Data\\infos.mod'],
      }),
    });

    const config = await loadConfiguration();
    expect(config?.filesCreated).toEqual(['Data/gui.mod', 'Data/infos.mod']);
  });

  test('migration is idempotent on a mixed entry config', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
      [path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json')]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        modsPath: 'E:\\Games\\Gothic 3\\mods',
        language: 'pl',
        ignoreDependencies: false,
        ignoreIncompatible: false,
        installedMods: [],
        filesCreated: [
          'E:\\Games\\Gothic 3\\Data\\gui.mod',
          'Data/infos.mod',
          'C:\\elsewhere\\file.mod',
        ],
      }),
    });

    const first = await loadConfiguration();
    await saveConfiguration(first as never);
    const second = await loadConfiguration();

    expect(first?.filesCreated).toEqual(['Data/gui.mod', 'Data/infos.mod']);
    expect(second?.filesCreated).toEqual(first?.filesCreated);
  });

  test('handles empty filesCreated without errors', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
      [path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json')]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        modsPath: 'E:\\Games\\Gothic 3\\mods',
        language: 'pl',
        ignoreDependencies: false,
        ignoreIncompatible: false,
        installedMods: [],
        filesCreated: [],
      }),
    });

    const config = await loadConfiguration();
    expect(config?.filesCreated).toEqual([]);
  });
});

describe('saveConfiguration', () => {
  test('creates config file with correct data', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: [],
      filesCreated: [],
    };
    await saveConfiguration(config);
    expect(
      fs.existsSync(path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json')),
    ).toBeTruthy();
  });

  test('doesnt create config for wrong data', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3': '',
    });
    const config = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: [],
      filesCreated: [],
    };
    await saveConfiguration(config);
    expect(fs.existsSync(path.join('\\user', 'documents', 'gothic3', CONFIG_FILE))).toBeFalsy();
  });
});
