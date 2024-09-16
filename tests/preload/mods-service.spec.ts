import { expect, test, vi, beforeEach, describe } from 'vitest';
import { vol } from 'memfs';
import {
  loadImages,
  loadModDescription,
  loadMods,
  validateMod,
} from '../../packages/preload/src/services/mod-service';
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

describe('validateMod', () => {
  test('returns mod for correct data', () => {
    const mod = {
      id: 'QuestPaket',
      title: 'QuestPaket',
      authors: ['Humanforce'],
      dependencies: [],
      incompatibles: [],
      category: 'QuestPacket 4.2',
    };
    vol.fromJSON(
      {
        'Gothic3.exe': '',
        'mods\\A_QuestPaket\\mod.json': JSON.stringify(mod),
      },
      'E:\\Games\\Gothic 3\\',
    );

    expect(validateMod('E:\\Games\\Gothic 3\\mods\\A_QuestPaket')).toMatchObject(mod);
  });

  test('returns null for missing mod.json', () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '',
      },
      'E:\\Games\\Gothic 3\\',
    );

    expect(validateMod('E:\\Games\\Gothic 3\\mods\\A_QuestPaket')).toBeNull();
  });

  test('returns null for missing id in json file', () => {
    const mod = {
      id: '',
      title: 'QuestPaket',
      authors: ['Humanforce'],
      dependencies: [],
      incompatibles: [],
      category: 'QuestPacket 4.2',
    };
    vol.fromJSON(
      {
        'mods\\A_QuestPaket\\mod.json': JSON.stringify(mod),
      },
      'E:\\Games\\Gothic 3\\',
    );

    expect(validateMod('E:\\Games\\Gothic 3\\mods\\A_QuestPaket')).toBeNull();
  });

  test('returns null for wrong structure in json file', () => {
    const mod = {
      id: 'QuestPaket',
      title: 'QuestPaket',
      authors: '',
      dependencies: '',
      incompatibles: [],
      category: 'QuestPacket 4.2',
    };
    vol.fromJSON(
      {
        'Gothic3.exe': '',
        'mods\\A_QuestPaket\\mod.json': JSON.stringify(mod),
      },
      'E:\\Games\\Gothic 3\\',
    );

    expect(validateMod('E:\\Games\\Gothic 3\\mods\\A_QuestPaket')).toBeNull();
  });
});

describe('loadModDescription', () => {
  test('returns readme_pl for correct data', async () => {
    const mod = {
      id: 'QuestPaket',
      title: 'QuestPaket',
      authors: '',
      dependencies: '',
      incompatibles: [],
      category: 'QuestPacket 4.2',
    };
    vol.fromJSON(
      {
        'Gothic3.exe': '',
        'mods\\A_QuestPaket\\mod.json': JSON.stringify(mod),
        'mods\\A_QuestPaket\\readme\\readme_pl.md': 'test content for readme file',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          ignoreDependencies: false,
          ignoreIncompatible: false,
          installedMods: [],
          filesCreated: [],
        }),
      },
      'E:\\Games\\Gothic 3\\',
    );

    await expect(loadModDescription('E:\\Games\\Gothic 3\\mods\\A_QuestPaket')).resolves.toBe(
      '<p>test content for readme file</p>\n',
    );
  });

  test('returns null for non existing readme_pl for polish language', async () => {
    const mod = {
      id: 'QuestPaket',
      title: 'QuestPaket',
      authors: '',
      dependencies: '',
      incompatibles: [],
      category: 'QuestPacket 4.2',
    };
    vol.fromJSON(
      {
        'Gothic3.exe': '',
        'mods\\A_QuestPaket\\mod.json': JSON.stringify(mod),
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          ignoreDependencies: false,
          ignoreIncompatible: false,
          installedMods: [],
          filesCreated: [],
        }),
      },
      'E:\\Games\\Gothic 3\\',
    );

    await expect(loadModDescription('E:\\Games\\Gothic 3\\mods\\A_QuestPaket')).resolves.toBeNull();
  });
});

describe('loadMods', () => {
  test('returns 3 mods for existing correct mods', async () => {
    const modQP = {
      id: 'QuestPaket',
      title: 'QuestPaket',
      authors: ['Humanforce'],
      dependencies: [],
      incompatibles: [],
      category: 'QuestPacket 4.2',
    };
    const modMain = {
      id: 'Main',
      title: 'Main',
      authors: [],
      dependencies: [],
      incompatibles: [],
      category: 'Base',
    };
    const modPD = {
      id: 'Pirate Dream',
      title: 'Pirate Dream',
      authors: [],
      dependencies: ['Main'],
      incompatibles: [],
      category: 'Story Mods',
    };

    vol.fromJSON(
      {
        'Gothic3.exe': '',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          ignoreDependencies: false,
          ignoreIncompatible: false,
          installedMods: [],
          filesCreated: [],
        }),
        'mods\\QuestPaket\\mod.json': JSON.stringify(modQP),
        'mods\\N_Main\\mod.json': JSON.stringify(modMain),
        'mods\\O_Pirate_Dream\\mod.json': JSON.stringify(modPD),
      },
      'E:\\Games\\Gothic 3\\',
    );

    const expectedMods = [modQP, modMain, modPD];

    await expect(loadMods()).resolves.toHaveLength(3);
    await expect(loadMods()).resolves.toMatchObject(expectedMods);
  });

  test('returns empty array for non existing modsPath in config', async () => {
    const modQP = {
      id: 'QuestPaket',
      title: 'QuestPaket',
      authors: ['Humanforce'],
      dependencies: [],
      incompatibles: [],
      category: 'QuestPacket 4.2',
    };
    const modMain = {
      id: 'Main',
      title: 'Main',
      authors: [],
      dependencies: [],
      incompatibles: [],
      category: 'Base',
    };
    const modPD = {
      id: 'Pirate Dream',
      title: 'Pirate Dream',
      authors: [],
      dependencies: ['Main'],
      incompatibles: [],
      category: 'Story Mods',
    };

    vol.fromJSON(
      {
        'Gothic3.exe': '',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          language: 'pl',
          ignoreDependencies: false,
          ignoreIncompatible: false,
          installedMods: [],
          filesCreated: [],
        }),
        'mods\\QuestPaket\\mod.json': JSON.stringify(modQP),
        'mods\\N_Main\\mod.json': JSON.stringify(modMain),
        'mods\\O_Pirate_Dream\\mod.json': JSON.stringify(modPD),
      },
      'E:\\Games\\Gothic 3\\',
    );

    await expect(loadMods()).resolves.toEqual([]);
    await expect(loadMods()).resolves.toHaveLength(0);
  });
});

describe('loadImages', () => {
  test('returns list of 3 images for formats png, jpg, jpeg', () => {
    const modQP = {
      id: 'QuestPaket',
      title: 'QuestPaket',
      authors: ['Humanforce'],
      dependencies: [],
      incompatibles: [],
      category: 'QuestPacket 4.2',
    };

    vol.fromJSON(
      {
        'Gothic3.exe': '',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          language: 'pl',
          ignoreDependencies: false,
          ignoreIncompatible: false,
          installedMods: [],
          filesCreated: [],
        }),
        'mods\\QuestPaket\\mod.json': JSON.stringify(modQP),
        'mods\\QuestPaket\\images\\back.png': '123',
        'mods\\QuestPaket\\images\\back.jpg': '1223',
        'mods\\QuestPaket\\images\\back.jpeg': '523',
      },
      'E:\\Games\\Gothic 3\\',
    );

    expect(loadImages('E:\\Games\\Gothic 3\\mods\\QuestPaket')).toHaveLength(3);
  });

  test('returns empty array for gif file', () => {
    const modQP = {
      id: 'QuestPaket',
      title: 'QuestPaket',
      authors: ['Humanforce'],
      dependencies: [],
      incompatibles: [],
      category: 'QuestPacket 4.2',
    };

    vol.fromJSON(
      {
        'Gothic3.exe': '',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          language: 'pl',
          ignoreDependencies: false,
          ignoreIncompatible: false,
          installedMods: [],
          filesCreated: [],
        }),
        'mods\\QuestPaket\\mod.json': JSON.stringify(modQP),
        'mods\\QuestPaket\\images\\back.gif': '123',
      },
      'E:\\Games\\Gothic 3\\',
    );
    expect(loadImages('E:\\Games\\Gothic 3\\mods\\QuestPaket')).toHaveLength(0);
  });

  test('returns empty array when there is no picture dir', () => {
    const modQP = {
      id: 'QuestPaket',
      title: 'QuestPaket',
      authors: ['Humanforce'],
      dependencies: [],
      incompatibles: [],
      category: 'QuestPacket 4.2',
    };

    vol.fromJSON(
      {
        'Gothic3.exe': '',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          language: 'pl',
          ignoreDependencies: false,
          ignoreIncompatible: false,
          installedMods: [],
          filesCreated: [],
        }),
        'mods\\QuestPaket\\mod.json': JSON.stringify(modQP),
        'mods\\QuestPaket\\back.png': '123',
      },
      'E:\\Games\\Gothic 3\\',
    );
    expect(loadImages('E:\\Games\\Gothic 3\\mods\\QuestPaket')).toHaveLength(0);
  });
});
