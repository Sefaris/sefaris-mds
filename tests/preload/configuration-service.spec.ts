import { expect, test, vi, beforeEach, describe, afterEach } from 'vitest';
import {
  isValidConfiguration,
  isGothicPathValid,
  loadConfiguration,
  loadConfigurationRaw,
  backupConfiguration,
  saveConfiguration,
} from '../../packages/preload/src/services/configuration-service';
import { ConfigurationError } from '../../Errors/ConfigurationError';
import { getMessage } from '../../utils/messages';
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

describe('loadConfiguration error variants', () => {
  const CONFIG_PATH = path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json');
  const BACKUP_PATH = `${CONFIG_PATH}.bak`;

  const validRest = {
    modsPath: 'E:\\Games\\Gothic 3\\mods',
    language: 'pl',
    ignoreDependencies: false,
    ignoreIncompatible: false,
    installedMods: ['ModA'],
    filesCreated: ['Data/gui.mod'],
  };

  test('throws INVALID_GAME_PATH when only gothicPath is invalid', async () => {
    vol.fromJSON({
      [CONFIG_PATH]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        ...validRest,
      }),
    });

    await expect(loadConfiguration()).rejects.toThrowError(getMessage('INVALID_GAME_PATH'));
  });

  test('attaches parsed config payload to INVALID_GAME_PATH error', async () => {
    vol.fromJSON({
      [CONFIG_PATH]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        ...validRest,
      }),
    });

    let caught: ConfigurationError | undefined;
    try {
      await loadConfiguration();
    } catch (error) {
      caught = error as ConfigurationError;
    }
    expect(caught).toBeInstanceOf(ConfigurationError);
    expect(caught?.config).toBeDefined();
    expect(caught?.config?.installedMods).toEqual(['ModA']);
    expect(caught?.config?.filesCreated).toEqual(['Data/gui.mod']);
    expect(caught?.config?.gothicPath).toBe('E:\\Games\\Gothic 3');
  });

  test('does NOT create a backup when only gothicPath is invalid', async () => {
    vol.fromJSON({
      [CONFIG_PATH]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        ...validRest,
      }),
    });

    await expect(loadConfiguration()).rejects.toThrow();
    expect(fs.existsSync(BACKUP_PATH)).toBeFalsy();
  });

  test('creates a .bak file when JSON is corrupted', async () => {
    vol.fromJSON({
      [CONFIG_PATH]: '{not valid json',
    });

    await expect(loadConfiguration()).rejects.toThrowError(getMessage('INVALID_CONFIGURATION'));
    expect(fs.existsSync(BACKUP_PATH)).toBeTruthy();
    expect(fs.readFileSync(BACKUP_PATH, 'utf8')).toBe('{not valid json');
  });

  test('creates a .bak file when configuration structure is invalid', async () => {
    vol.fromJSON({
      [CONFIG_PATH]: JSON.stringify({ gothicPath: 'E:\\Games\\Gothic 3' }),
    });

    await expect(loadConfiguration()).rejects.toThrowError(getMessage('INVALID_CONFIGURATION'));
    expect(fs.existsSync(BACKUP_PATH)).toBeTruthy();
  });

  test('throws MISSING_CONFIGURATION when file does not exist (no backup)', async () => {
    vol.fromJSON({});
    await expect(loadConfiguration()).rejects.toThrowError(getMessage('MISSING_CONFIGURATION'));
    expect(fs.existsSync(BACKUP_PATH)).toBeFalsy();
  });
});

describe('loadConfigurationRaw', () => {
  const CONFIG_PATH = path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json');

  test('returns parsed config without validating gothicPath', async () => {
    const raw = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: ['ModA', 'ModB'],
      filesCreated: ['Data/gui.mod'],
    };
    vol.fromJSON({ [CONFIG_PATH]: JSON.stringify(raw) });

    const result = await loadConfigurationRaw();
    expect(result.installedMods).toEqual(['ModA', 'ModB']);
    expect(result.filesCreated).toEqual(['Data/gui.mod']);
    expect(result.gothicPath).toBe('E:\\Games\\Gothic 3');
  });

  test('throws MISSING_CONFIGURATION when file does not exist', async () => {
    vol.fromJSON({});
    await expect(loadConfigurationRaw()).rejects.toThrowError(getMessage('MISSING_CONFIGURATION'));
  });

  test('throws INVALID_CONFIGURATION when JSON is malformed', async () => {
    vol.fromJSON({ [CONFIG_PATH]: '{bad json' });
    await expect(loadConfigurationRaw()).rejects.toThrowError(getMessage('INVALID_CONFIGURATION'));
  });

  test('throws INVALID_CONFIGURATION when structure is invalid', async () => {
    vol.fromJSON({ [CONFIG_PATH]: JSON.stringify({ gothicPath: 'X' }) });
    await expect(loadConfigurationRaw()).rejects.toThrowError(getMessage('INVALID_CONFIGURATION'));
  });

  test('does not migrate filesCreated entries (gothicPath may be invalid)', async () => {
    vol.fromJSON({
      [CONFIG_PATH]: JSON.stringify({
        gothicPath: 'E:\\Games\\Gothic 3',
        modsPath: 'E:\\Games\\Gothic 3\\mods',
        language: 'pl',
        ignoreDependencies: false,
        ignoreIncompatible: false,
        installedMods: [],
        filesCreated: ['E:\\Games\\Gothic 3\\Data\\gui.mod'],
      }),
    });

    const result = await loadConfigurationRaw();
    // raw should keep original (absolute) entry — migration runs only after
    // a valid gothicPath has been set via loadConfiguration.
    expect(result.filesCreated).toEqual(['E:\\Games\\Gothic 3\\Data\\gui.mod']);
  });
});

describe('backupConfiguration', () => {
  const CONFIG_PATH = path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json');
  const BACKUP_PATH = `${CONFIG_PATH}.bak`;

  test('creates a .bak copy of the existing config file', () => {
    vol.fromJSON({ [CONFIG_PATH]: 'original-content' });
    backupConfiguration(CONFIG_PATH);
    expect(fs.existsSync(BACKUP_PATH)).toBeTruthy();
    expect(fs.readFileSync(BACKUP_PATH, 'utf8')).toBe('original-content');
  });

  test('overwrites a previous .bak (single-slot retention)', () => {
    vol.fromJSON({
      [CONFIG_PATH]: 'new-content',
      [BACKUP_PATH]: 'old-backup',
    });
    backupConfiguration(CONFIG_PATH);
    expect(fs.readFileSync(BACKUP_PATH, 'utf8')).toBe('new-content');
  });

  test('does nothing when source file does not exist', () => {
    vol.fromJSON({});
    expect(() => backupConfiguration(CONFIG_PATH)).not.toThrow();
    expect(fs.existsSync(BACKUP_PATH)).toBeFalsy();
  });
});

describe('uiPreferences migration', () => {
  const CONFIG_PATH = path.join('\\user', 'documents', 'gothic3', 'StarterConfig.json');

  const baseConfig = {
    gothicPath: 'E:\\Games\\Gothic 3',
    modsPath: 'E:\\Games\\Gothic 3\\mods',
    language: 'pl',
    ignoreDependencies: false,
    ignoreIncompatible: false,
    installedMods: [],
    filesCreated: [],
  };

  test('defaults uiPreferences.modListMode to "flat" when missing', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
      [CONFIG_PATH]: JSON.stringify(baseConfig),
    });

    const config = await loadConfiguration();
    expect(config?.uiPreferences).toEqual({ modListMode: 'flat' });
  });

  test('preserves a valid uiPreferences value', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
      [CONFIG_PATH]: JSON.stringify({
        ...baseConfig,
        uiPreferences: { modListMode: 'grouped' },
      }),
    });

    const config = await loadConfiguration();
    expect(config?.uiPreferences).toEqual({ modListMode: 'grouped' });
  });

  test('rejects configs whose uiPreferences.modListMode is invalid', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
      [CONFIG_PATH]: JSON.stringify({
        ...baseConfig,
        uiPreferences: { modListMode: 'tree' },
      }),
    });

    await expect(loadConfiguration()).rejects.toThrowError(getMessage('INVALID_CONFIGURATION'));
  });

  test('isValidConfiguration accepts a config with uiPreferences', () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    expect(
      isValidConfiguration({
        ...baseConfig,
        uiPreferences: { modListMode: 'grouped' },
      } as never),
    ).toBeTruthy();
  });

  test('saved config round-trips uiPreferences', async () => {
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '',
    });
    const config = {
      ...baseConfig,
      uiPreferences: { modListMode: 'grouped' as const },
    };
    await saveConfiguration(config);
    const reloaded = await loadConfiguration();
    expect(reloaded?.uiPreferences).toEqual({ modListMode: 'grouped' });
  });
});
