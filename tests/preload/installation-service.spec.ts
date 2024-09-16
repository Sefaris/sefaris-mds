import { expect, test, vi, beforeEach, describe, afterAll, beforeAll } from 'vitest';
import {
  buildWrldatasc,
  deleteMods,
  getNewModsFilesPaths,
  getNextSaveDirectoryName,
  getOldModsFiles,
  installMods,
  mergeStringTables,
  moveSaves,
} from '../../packages/preload/src/services/installation-service';
import { fs, vol } from 'memfs';
import path from 'path';
import { UTF8 } from '../../utils/constants';
import os from 'os';
import type { Mod } from '../../interfaces/Mod';

const baseDir = path.resolve();

beforeEach(() => {
  vol.reset();
});

beforeAll(() => {
  global.alert = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).window = {
    postMessage: vi.fn(),
  };
  const mockHomedir = '/user/';
  vi.spyOn(os, 'homedir').mockReturnValue(mockHomedir);

  vi.mock('../../packages/preload/src/services/file-service', async () => {
    return {
      ...(await vi.importActual('../../packages/preload/src/services/file-service'))!,
      getDocumentsPath: vi.fn(() => Promise.resolve('\\user\\Documents')),
    };
  });

  vi.mock('../../packages/preload/src/services/pak-service', async () => ({
    ...(await vi.importActual('../../packages/preload/src/services/pak-service'))!,
    extract: vi.fn(() => Promise.resolve()),
    findStrings: vi.fn(() => 'strings.pak'),
    buildPackage: vi.fn((src: string, dst: string) => fs.writeFileSync(dst, '')),
  }));
  vi.mock('path', async () => {
    return await vi.importActual('path');
  });
  vi.mock('fs', async () => {
    const { fs } = await import('memfs');
    return {
      ...fs,
    };
  });
});

afterAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (global as any).window;
  vi.restoreAllMocks();
});

describe('deleteMods', () => {
  test('deletes files included in config', async () => {
    const installedFiles = [
      'E:\\Games\\Gothic 3\\Data\\gui.mod',
      'E:\\Games\\Gothic 3\\Data\\infos.mod',
      'E:\\Games\\Gothic 3\\Data\\quests.mod',
      'E:\\Games\\Gothic 3\\Data\\templates.mod',
      'E:\\Games\\Gothic 3\\Data\\_compiledanimation.mod',
    ];
    const configContent = JSON.stringify({
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: ['mod'],
      filesCreated: installedFiles,
    });

    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: configContent,
        'Data\\gui.mod': '',
        'Data\\infos.mod': '',
        'Data\\quests.mod': '',
        'Data\\templates.mod': '',
        'Data\\_compiledanimation.mod': '',
      },
      'E:\\Games\\Gothic 3',
    );

    await deleteMods();

    installedFiles.forEach(file => {
      expect(fs.existsSync(file)).toBeFalsy();
    });
  });

  test('throws error for not existing files', async () => {
    const installedFiles = [
      'E:\\Games\\Gothic 3\\Data\\gui.mod',
      'E:\\Games\\Gothic 3\\Data\\infos.mod',
      'E:\\Games\\Gothic 3\\Data\\quests.mod',
      'E:\\Games\\Gothic 3\\Data\\templates.mod',
      'E:\\Games\\Gothic 3\\Data\\_compiledanimation.mod',
    ];
    const configContent = JSON.stringify({
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: ['mod'],
      filesCreated: installedFiles,
    });

    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: configContent,
        'Data\\gui.mod': '',
        'Data\\infos.mod': '',
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(deleteMods()).rejects.toThrowError();
  });

  test('returns object with 2 empty arrays', async () => {
    const installedFiles = [
      'E:\\Games\\Gothic 3\\Data\\gui.mod',
      'E:\\Games\\Gothic 3\\Data\\infos.mod',
      'E:\\Games\\Gothic 3\\Data\\quests.mod',
      'E:\\Games\\Gothic 3\\Data\\templates.mod',
      'E:\\Games\\Gothic 3\\Data\\_compiledanimation.mod',
    ];

    const configContent = JSON.stringify({
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: ['mod'],
      filesCreated: installedFiles,
    });

    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: configContent,
        'Data\\gui.mod': '',
        'Data\\infos.mod': '',
        'Data\\quests.mod': '',
        'Data\\templates.mod': '',
        'Data\\_compiledanimation.mod': '',
      },
      'E:\\Games\\Gothic 3',
    );

    const expectedConfig = {
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: [],
      filesCreated: [],
    };
    await deleteMods();
    expect(
      JSON.parse(fs.readFileSync(path.join(baseDir, 'config.json'), UTF8) as string),
    ).toMatchObject(expectedConfig);
  });

  test('doesnt remove files not included in config', async () => {
    const files = [
      'E:\\Games\\Gothic 3\\Data\\gui.mod',
      'E:\\Games\\Gothic 3\\Data\\infos.mod',
      'E:\\Games\\Gothic 3\\Data\\quests.mod',
      'E:\\Games\\Gothic 3\\Data\\templates.mod',
      'E:\\Games\\Gothic 3\\Data\\_compiledanimation.mod',
    ];

    const configContent = JSON.stringify({
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: [],
      filesCreated: [],
    });

    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: configContent,
        'Data\\gui.mod': '',
        'Data\\infos.mod': '',
        'Data\\quests.mod': '',
        'Data\\templates.mod': '',
        'Data\\_compiledanimation.mod': '',
      },
      'E:\\Games\\Gothic 3',
    );

    await deleteMods();
    files.forEach(file => {
      expect(fs.existsSync(file)).toBeTruthy();
    });
  });
});

describe('getNextSaveDirectoryName', () => {
  test('returns folder name Mods2', () => {
    vol.fromJSON(
      {
        Mods0: '',
        Mods1: '',
      },
      path.join('', os.homedir(), 'Documents', 'gothic3'),
    );
    expect(getNextSaveDirectoryName()).resolves.toEqual('Mods2');
  });

  test('returns folder name Mods0', () => {
    vol.fromJSON(
      {
        file: '',
      },
      path.join(os.homedir(), 'Documents', 'gothic3'),
    );
    expect(getNextSaveDirectoryName()).resolves.toEqual('Mods0');
  });

  test('returns folder name Mods5', () => {
    vol.fromJSON(
      {
        Mods0: '',
        Mods4: '',
      },
      path.join('', os.homedir(), 'Documents', 'gothic3'),
    );
    expect(getNextSaveDirectoryName()).resolves.toEqual('Mods5');
  });
});

describe('getOldModsFiles', () => {
  test('returns array with 11 paths', async () => {
    vol.fromJSON(
      {
        Mods0: '',
        'save1.g3savcpx': '',
        'save2.g3savcpx': '',
        'save3.g3savcpx': '',
        'save4.g3savcpx': '',
        'save5.g3savcpx': '',
        'save1.g3savcpxdat': '',
        'save2.g3savcpxdat': '',
        'save3.g3savcpxdat': '',
        'save4.g3savcpxdat': '',
        'save5.g3savcpxdat': '',
        'Shader.Cache': '',
      },
      path.join('', os.homedir(), 'Documents', 'gothic3'),
    );
    const oldSaveFiles = await getOldModsFiles();
    const expectedResult = [
      '\\user\\Documents\\gothic3\\save1.g3savcpx',
      '\\user\\Documents\\gothic3\\save2.g3savcpx',
      '\\user\\Documents\\gothic3\\save3.g3savcpx',
      '\\user\\Documents\\gothic3\\save4.g3savcpx',
      '\\user\\Documents\\gothic3\\save5.g3savcpx',
      '\\user\\Documents\\gothic3\\save1.g3savcpxdat',
      '\\user\\Documents\\gothic3\\save2.g3savcpxdat',
      '\\user\\Documents\\gothic3\\save3.g3savcpxdat',
      '\\user\\Documents\\gothic3\\save4.g3savcpxdat',
      '\\user\\Documents\\gothic3\\save5.g3savcpxdat',
      '\\user\\Documents\\gothic3\\Shader.Cache',
    ];
    expect(oldSaveFiles).toHaveLength(11);
    expect(oldSaveFiles).toEqual(expectedResult);
  });

  test('returns array with 10 paths', async () => {
    vol.fromJSON(
      {
        Mods0: '',
        'save1.g3savcpx': '',
        'save2.g3savcpx': '',
        'save3.g3savcpx': '',
        'save4.g3savcpx': '',
        'save5.g3savcpx': '',
        'save1.g3savcpxdat': '',
        'save2.g3savcpxdat': '',
        'save3.g3savcpxdat': '',
        'save4.g3savcpxdat': '',
        'save5.g3savcpxdat': '',
      },
      path.join('', os.homedir(), 'Documents', 'gothic3'),
    );
    const oldSaveFiles = await getOldModsFiles();
    const expectedResult = [
      '\\user\\Documents\\gothic3\\save1.g3savcpx',
      '\\user\\Documents\\gothic3\\save2.g3savcpx',
      '\\user\\Documents\\gothic3\\save3.g3savcpx',
      '\\user\\Documents\\gothic3\\save4.g3savcpx',
      '\\user\\Documents\\gothic3\\save5.g3savcpx',
      '\\user\\Documents\\gothic3\\save1.g3savcpxdat',
      '\\user\\Documents\\gothic3\\save2.g3savcpxdat',
      '\\user\\Documents\\gothic3\\save3.g3savcpxdat',
      '\\user\\Documents\\gothic3\\save4.g3savcpxdat',
      '\\user\\Documents\\gothic3\\save5.g3savcpxdat',
    ];
    expect(oldSaveFiles).toHaveLength(10);
    expect(oldSaveFiles).toEqual(expectedResult);
  });

  test('returns empty array', async () => {
    vol.fromJSON(
      {
        Mods0: '',
      },
      path.join('', os.homedir(), 'Documents', 'gothic3'),
    );
    const oldSaveFiles = await getOldModsFiles();
    expect(oldSaveFiles).toHaveLength(0);
  });

  test('returns array with 1 path', async () => {
    vol.fromJSON(
      {
        Mods0: '',
        'Shader.Cache': '',
      },
      path.join('', os.homedir(), 'Documents', 'gothic3'),
    );
    const expectedResult = ['\\user\\Documents\\gothic3\\Shader.Cache'];
    const oldSaveFiles = await getOldModsFiles();
    expect(oldSaveFiles).toHaveLength(1);
    expect(oldSaveFiles).toEqual(expectedResult);
  });
});

describe('getNewModsFilesPaths', () => {
  test('moves old save files and shader into Mods1 folder', async () => {
    vol.fromJSON(
      {
        'save1.g3savcpx': '',
        'save2.g3savcpx': '',
        'save1.g3savcpxdat': '',
        'save2.g3savcpxdat': '',
        'Shader.Cache': '',
      },
      path.join(os.homedir(), 'Documents', 'gothic3'),
    );
    const oldPaths = [
      path.join(os.homedir(), 'Documents', 'gothic3', 'save1.g3savcpx'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'save2.g3savcpx'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'save1.g3savcpxdat'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'save2.g3savcpxdat'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'Shader.Cache'),
    ];
    const expectedPaths = [
      path.join(os.homedir(), 'Documents', 'gothic3', 'Mods0', 'save1.g3savcpx'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'Mods0', 'save2.g3savcpx'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'Mods0', 'save1.g3savcpxdat'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'Mods0', 'save2.g3savcpxdat'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'Mods0', 'Shader.Cache'),
    ];
    expect(getNewModsFilesPaths(oldPaths, 'Mods0')).resolves.toEqual(expectedPaths);
  });
});

describe('moveSaves', () => {
  test('moves old save files and shader into Mods1 folder', async () => {
    vol.fromJSON(
      {
        Mods0: '',
        'save1.g3savcpx': '',
        'save2.g3savcpx': '',
        'save1.g3savcpxdat': '',
        'save2.g3savcpxdat': '',
        'Shader.Cache': '',
      },
      path.join(os.homedir(), 'Documents', 'gothic3'),
    );
    await moveSaves();
    const previousPaths = [
      path.join(os.homedir(), 'Documents', 'gothic3', 'save1.g3savcpx'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'save2.g3savcpx'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'save1.g3savcpxdat'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'save2.g3savcpxdat'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'Shader.Cache'),
    ];
    const expectedPaths = [
      path.join(os.homedir(), 'Documents', 'gothic3', 'Mods1', 'save1.g3savcpx'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'Mods1', 'save2.g3savcpx'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'Mods1', 'save1.g3savcpxdat'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'Mods1', 'save2.g3savcpxdat'),
      path.join(os.homedir(), 'Documents', 'gothic3', 'Mods1', 'Shader.Cache'),
    ];
    previousPaths.forEach(item => {
      expect(fs.existsSync(item)).toBeFalsy();
    });
    expectedPaths.forEach(item => {
      expect(fs.existsSync(item)).toBeTruthy();
    });
  });
});

describe('mergeStringTables', () => {
  test('merges 2 mods strings into stringtable', async () => {
    vol.fromJSON(
      {
        'temp\\stringtable.ini': '',
        'Mod1\\stringtable.ini': '',
        'Mod2\\stringtable.ini': '',
      },
      '/data/',
    );

    const stringtableContentBuffer = Buffer.from(
      `[LocAdmin_Languages]
Languages=English;Italian;French;German;Spanish;Czech;Hungarian;Polish;Russian;TRC
CurrentLanguage=English
CurrentRevision=0
[LocAdmin_Strings]
ATTRIB_ALC=Alchemy;;Alchimia;;Alchimie;;Alchemie;;Alquimia;;Alchymie;;Alkímia;;Alchemia;;Алхимия;;煉金術;
ATTRIB_DEX=Hunting skill;;Abilità nella caccia;;Compétence de chasse;;Jagdgeschick;;Habilidad de caza;;Lov;;Vadászat;;Zdolności łowieckie;;Ловкость;;狩獵技能;
ATTRIB_HP=Life energy;;Energia vitale;;Énergie vitale;;Lebensenergie;;Energía vital;;Životy;;Életerő;;Energia życiowa;;Жизненная энергия;;生命能量;
[LocAdmin_Revisions]`,
      'utf16le',
    );
    const mod1ContentBuffer = Buffer.from(
      `[LocAdmin_Strings]
  FO_It_EnchantStone_RepairWeapon=[EN];;-;;-;;[GE];;-;;-;;-;;Kamień odnowy;;[RU];;;`,
      'utf16le',
    );
    const mod2ContentBuffer = Buffer.from(
      `[LocAdmin_Strings]
    FO_It_EnchantStone_Weapon_SetWorn=[EN];;-;;-;;[GE];;-;;-;;-;;Kamień zniszczenia;;[RU];;;`,
      'utf16le',
    );

    const expectedResult = `[LocAdmin_Languages]
Languages=English;Italian;French;German;Spanish;Czech;Hungarian;Polish;Russian;TRC
CurrentLanguage=English
CurrentRevision=0
[LocAdmin_Strings]
ATTRIB_ALC=Alchemy;;Alchimia;;Alchimie;;Alchemie;;Alquimia;;Alchymie;;Alkímia;;Alchemia;;Алхимия;;煉金術;
ATTRIB_DEX=Hunting skill;;Abilità nella caccia;;Compétence de chasse;;Jagdgeschick;;Habilidad de caza;;Lov;;Vadászat;;Zdolności łowieckie;;Ловкость;;狩獵技能;
ATTRIB_HP=Life energy;;Energia vitale;;Énergie vitale;;Lebensenergie;;Energía vital;;Životy;;Életerő;;Energia życiowa;;Жизненная энергия;;生命能量;

  FO_It_EnchantStone_RepairWeapon=[EN];;-;;-;;[GE];;-;;-;;-;;Kamień odnowy;;[RU];;;
    FO_It_EnchantStone_Weapon_SetWorn=[EN];;-;;-;;[GE];;-;;-;;-;;Kamień zniszczenia;;[RU];;;
[LocAdmin_Revisions]`;
    const mods = [
      {
        id: 'Mod1',
        title: 'Mod1',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod1',
        authors: ['Autor'],
        path: '\\data\\Mod1',
      },
      {
        id: 'Mod2',
        title: 'Mod2',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod2',
        authors: ['Autor'],
        path: '\\data\\Mod2',
      },
    ];

    fs.writeFileSync(path.join('\\data', 'temp', 'stringtable.ini'), stringtableContentBuffer);
    fs.writeFileSync(path.join('\\data', 'Mod1', 'stringtable.ini'), mod1ContentBuffer);
    fs.writeFileSync(path.join('\\data', 'Mod2', 'stringtable.ini'), mod2ContentBuffer);

    await mergeStringTables('\\data', mods, '');

    const result = fs.readFileSync(path.join('\\data', 'temp', 'stringtable.ini'), 'utf16le');

    expect(result).toEqual(expectedResult);
  });
});

describe('installMods', () => {
  test('returns time after succesful installation', async () => {
    const configContent = JSON.stringify({
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: [],
      filesCreated: [],
    });
    const mods = [
      {
        id: 'Mod1',
        title: 'Mod1',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod1',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\mod1',
      },
      {
        id: 'Mod2',
        title: 'Mod2',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod2',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\mod2',
      },
    ];
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '{}',
      [path.join(baseDir, 'config.json')]: configContent,
      '\\user\\Documents\\gothic3\\Mods0': '',
      [path.join(baseDir, 'Static', 'Projects_compiled.m0x')]: '',
      [path.join(baseDir, 'Static', 'Projects_compiled.n0x')]: '',
      [path.join(baseDir, 'Static', 'G3_World_01.wrldatasc')]: '',
      'E:\\Games\\Gothic 3\\mods\\mod1\\mod.json': JSON.stringify(mods[0]),
      'E:\\Games\\Gothic 3\\mods\\mod1\\file1.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod1\\file2.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod1\\file3.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod2\\mod.json': JSON.stringify(mods[1]),
      'E:\\Games\\Gothic 3\\mods\\mod2\\file1.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod2\\file2.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod2\\file3.m0x': '',
      'E:\\Games\\Gothic 3\\Data\\strings.pak': '',
      'E:\\Games\\Gothic 3\\Data\\temp\\stringtable.ini': '',
    });

    const modsIds = mods.map(item => item.id);
    expect(installMods(modsIds)).resolves.toBeTypeOf('string');
  });

  test('rejects for empty modsIds list', async () => {
    const configContent = JSON.stringify({
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: [],
      filesCreated: [],
    });
    const mods = [
      {
        id: 'Mod1',
        title: 'Mod1',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod1',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\mod1',
      },
      {
        id: 'Mod2',
        title: 'Mod2',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod2',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\mod2',
      },
    ];
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '{}',
      [path.join(baseDir, 'config.json')]: configContent,
      '\\user\\Documents\\gothic3\\Mods0': '',
      [path.join(baseDir, 'Static', 'Projects_compiled.m0x')]: '',
      [path.join(baseDir, 'Static', 'Projects_compiled.n0x')]: '',
      [path.join(baseDir, 'Static', 'G3_World_01.wrldatasc')]: '',
      'E:\\Games\\Gothic 3\\mods\\mod1\\mod.json': JSON.stringify(mods[0]),
      'E:\\Games\\Gothic 3\\mods\\mod1\\file1.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod1\\file2.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod1\\file3.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod2\\mod.json': JSON.stringify(mods[1]),
      'E:\\Games\\Gothic 3\\mods\\mod2\\file1.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod2\\file2.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod2\\file3.m0x': '',
      'E:\\Games\\Gothic 3\\Data\\strings.pak': '',
      'E:\\Games\\Gothic 3\\Data\\temp\\stringtable.ini': '',
    });

    const modsIds: string[] = [];
    expect(installMods(modsIds)).rejects.toThrowError();
  });

  test('rejects for missing static files', async () => {
    const configContent = JSON.stringify({
      gothicPath: 'E:\\Games\\Gothic 3',
      modsPath: 'E:\\Games\\Gothic 3\\mods',
      language: 'pl',
      ignoreDependencies: false,
      ignoreIncompatible: false,
      installedMods: [],
      filesCreated: [],
    });
    const mods = [
      {
        id: 'Mod1',
        title: 'Mod1',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod1',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\mod1',
      },
      {
        id: 'Mod2',
        title: 'Mod2',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod2',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\mod2',
      },
    ];
    vol.fromJSON({
      'E:\\Games\\Gothic 3\\Gothic3.exe': '{}',
      [path.join(baseDir, 'config.json')]: configContent,
      '\\user\\Documents\\gothic3\\Mods0': '',
      'E:\\Games\\Gothic 3\\mods\\mod1\\mod.json': JSON.stringify(mods[0]),
      'E:\\Games\\Gothic 3\\mods\\mod1\\file1.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod1\\file2.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod1\\file3.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod2\\mod.json': JSON.stringify(mods[1]),
      'E:\\Games\\Gothic 3\\mods\\mod2\\file1.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod2\\file2.m0x': '',
      'E:\\Games\\Gothic 3\\mods\\mod2\\file3.m0x': '',
      'E:\\Games\\Gothic 3\\Data\\strings.pak': '',
      'E:\\Games\\Gothic 3\\Data\\temp\\stringtable.ini': '',
    });

    const modsIds = mods.map(item => item.id);
    expect(installMods(modsIds)).rejects.toThrowError();
  });
});

describe('buildWrldatasc', () => {
  test('merges wrldatasc', async () => {
    vol.fromJSON({
      [path.join(baseDir, 'Static', 'G3_World_01.wrldatasc')]: '',
      [path.join(baseDir, 'Static', 'Projects_compiled.m0x')]: '',
      [path.join(baseDir, 'Static', 'Projects_compiled.n0x')]: '',
      'E:\\Games\\Gothic 3\\data\\projects_compiled.mod': '',
    });

    const mods = [
      {
        id: 'Mod1',
        title: 'Mod1',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod1',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\Mod1',
      },
      {
        id: 'Mod2',
        title: 'Mod2',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod2',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\Mod2',
      },
    ];

    const createdFiles: string[] = [];
    await buildWrldatasc('E:\\Games\\Gothic 3\\data', mods, createdFiles);
    expect(createdFiles).toEqual(['E:\\Games\\Gothic 3\\data\\projects_compiled.m00']);
  });

  test('throws error for missing projects_compiled', async () => {
    vol.fromJSON({
      [path.join(baseDir, 'Static', 'G3_World_01.wrldatasc')]: '',
      [path.join(baseDir, 'Static', 'Projects_compiled.m0x')]: '',
      [path.join(baseDir, 'Static', 'Projects_compiled.n0x')]: '',
    });

    const mods = [
      {
        id: 'Mod1',
        title: 'Mod1',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod1',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\Mod1',
      },
      {
        id: 'Mod2',
        title: 'Mod2',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod2',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\Mod2',
      },
    ];

    const createdFiles: string[] = [];
    expect(buildWrldatasc('E:\\Games\\Gothic 3\\data', mods, createdFiles)).rejects.toThrowError();
  });

  test('throws error for missing G3_World_01', async () => {
    vol.fromJSON({
      [path.join(baseDir, 'Static', 'Projects_compiled.m0x')]: '',
      [path.join(baseDir, 'Static', 'Projects_compiled.n0x')]: '',
      'E:\\Games\\Gothic 3\\data\\projects_compiled.mod': '',
    });

    const mods = [
      {
        id: 'Mod1',
        title: 'Mod1',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod1',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\Mod1',
      },
      {
        id: 'Mod2',
        title: 'Mod2',
        category: 'category',
        dependencies: [],
        incompatibles: [],
        directoryName: 'Mod2',
        authors: ['Autor'],
        path: 'E:\\Games\\Gothic 3\\mods\\Mod2',
      },
    ];

    const createdFiles: string[] = [];
    expect(buildWrldatasc('E:\\Games\\Gothic 3\\data', mods, createdFiles)).rejects.toThrowError();
  });

  test('throws error for missing mods', async () => {
    vol.fromJSON({
      [path.join(baseDir, 'Static', 'G3_World_01.wrldatasc')]: '',
      [path.join(baseDir, 'Static', 'Projects_compiled.m0x')]: '',
      [path.join(baseDir, 'Static', 'Projects_compiled.n0x')]: '',
      'E:\\Games\\Gothic 3\\data\\projects_compiled.mod': '',
    });

    const mods: Mod[] = [];

    const createdFiles: string[] = [];
    expect(buildWrldatasc('E:\\Games\\Gothic 3\\data', mods, createdFiles)).rejects.toThrowError();
  });
});
