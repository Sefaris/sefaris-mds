import { expect, test, vi, beforeEach, describe } from 'vitest';
import { vol, fs } from 'memfs';
import {
  parseConfig,
  getAllIniNames,
  loadIniConfiguration,
  validateIniFile,
  saveIniConfiguration,
} from '../../packages/preload/src/services/ini-service';
import path from 'path';
import { UTF8 } from '../../utils/constants';

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

describe('parseConfig', () => {
  test('matches object for all types of data', () => {
    const ini = `[Main]
FontName=Comic Sans MS
; lorem
; string, Comic Sans MS
FontSize=16
; lorem
; number, 16
; 0|60

FontBold=false
; lorem
; boolean, false

[Mode]
Mode=Default
; Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]
; mode, Default
; Default|NoThreshold|Hardcore

[Thresholds]
STR=200;300;400
; lorem
; array, arrayType:number, 200;300;400

[QuickLoot]
IgnoredItems=It_Bradley_SlaveList;It_Brandon_Name
; List of ignored items
; array, arrayType:string, It_Bradley_SlaveList;
AutoLootToggleHotkey=SEMICOLON
;lorem ipsum
; key,  SEMICOLON
AutoLootIconPosTopX=98.500000
; lorem ipsum
; number,  98.5
; 1|300|0.5`;

    const expectedOutput = JSON.parse(
      '[{"name":"Main","options":[{"name":"FontName","description":"lorem","value":"Comic Sans MS","type":"string","defaultValue":"Comic Sans MS"},{"name":"FontSize","description":"lorem","value":16,"type":"number","defaultValue":16,"ranges":[0,60]},{"name":"FontBold","description":"lorem","value":false,"type":"boolean","defaultValue":false}]},{"name":"Mode","options":[{"name":"Mode","description":"Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]","value":"Default","type":"mode","defaultValue":"Default","modes":["Default","NoThreshold","Hardcore"]}]},{"name":"Thresholds","options":[{"name":"STR","description":"lorem","value":[200,300,400],"type":"arrayType:number","defaultValue":[200,300,400]}]},{"name":"QuickLoot","options":[{"name":"IgnoredItems","description":"List of ignored items","value":["It_Bradley_SlaveList","It_Brandon_Name"],"type":"arrayType:string","defaultValue":["It_Bradley_SlaveList"]},{"name":"AutoLootToggleHotkey","description":"lorem ipsum","value":"SEMICOLON","type":"key","defaultValue":"SEMICOLON"},{"name":"AutoLootIconPosTopX","description":"lorem ipsum","value":98.5,"type":"number","defaultValue":98.5,"ranges":[1,300,0.5]}]}]',
    );

    expect(parseConfig(ini, 'Config')).toMatchObject(expectedOutput);
  });

  test('ignores options without additional parsing info and calls console error', () => {
    const ini = `[Main]
Autor=Fyryny
FontName=Comic Sans MS
; lorem
; string, Comic Sans MS
FontSize=16
; lorem
; number, 16
; 0|60`;

    const expectedOutput = JSON.parse(
      '[{"name":"Main","options":[{"name":"FontName","description":"lorem","value":"Comic Sans MS","type":"string","defaultValue":"Comic Sans MS"},{"name":"FontSize","description":"lorem","value":16,"type":"number","defaultValue":16,"ranges":[0,60]}]}]',
    );

    expect(parseConfig(ini, 'Config')).toMatchObject(expectedOutput);
  });

  test('returns empty array for missing section', () => {
    const ini = `
Autor=Fyryny
FontName=Comic Sans MS
; lorem
; string, Comic Sans MS
FontSize=16
; lorem
; number, 16
; 0|60`;

    expect(parseConfig(ini, 'Config')).toMatchObject([]);
  });

  test('ignores options without section', () => {
    const ini = `
Autor=Fyryny
FontName=Comic Sans MS
; lorem
; string, Comic Sans MS
[Main]
FontSize=16
; lorem
; number, 16
; 0|60`;

    expect(parseConfig(ini, 'Config')).toHaveLength(1);
  });

  test('returns empty array for missing description and data info and call console error', () => {
    const ini = `[Main]
Autor=Fyryny
FontName=Comic Sans MS
FontSize=16`;

    expect(parseConfig(ini, 'Config')).toMatchObject([]);
  });

  test('returns object option with min 0, max 60, step 2', () => {
    const ini = `[Main]
FontSize=16
; lorem
; number, 16
; 0|60|2`;
    const expectedOutput = JSON.parse(
      '[{"name":"Main","options":[{"name":"FontSize","description":"lorem","value":16,"type":"number","defaultValue":16,"ranges":[0,60,2]}]}]',
    );

    expect(parseConfig(ini, 'Config')).toMatchObject(expectedOutput);
  });

  test('returns empty array for incorrect ranges', () => {
    const ini = `[Main]
FontSize=16
; lorem
; number, 16
; 12`;
    const parsedConfig = parseConfig(ini, 'Config');

    expect(parsedConfig).toHaveLength(0);
  });

  test('calls console error for missing ranges for number', () => {
    const ini = `[Main]
FontSize=16
; lorem
; number, 16`;

    expect(parseConfig(ini, 'Config')).toHaveLength(0);
  });

  test('returns object with 3 values in array', () => {
    const ini = `[Thresholds]
STR=200;300;400
; lorem
; array, arrayType:number, 200;300;400`;

    const parsedConfig = parseConfig(ini, 'Config');

    expect(parsedConfig[0].options[0].value).toHaveLength(3);
  });

  test('returns object with 1 value in array', () => {
    const ini = `[Thresholds]
STR=200;
; lorem
; array, arrayType:number, 200;300;400`;

    const parsedConfig = parseConfig(ini, 'Config');

    expect(parsedConfig[0].options[0].value).toHaveLength(1);
  });

  test('returns object with empty array', () => {
    const ini = `[Thresholds]
STR=
; lorem
; array, arrayType:number, 200;300;400`;

    const parsedConfig = parseConfig(ini, 'Config');

    expect(parsedConfig[0].options[0].value).toHaveLength(0);
  });

  test('returns empty array for wrong arrayType', () => {
    const ini = `[Test]
IgnoredItems=It_Bradley_SlaveList;It_Brandon_Name
; List of ignored items
; array, arrayType:asd, It_Bradley_SlaveList;`;

    expect(parseConfig(ini, 'Config')).toHaveLength(0);
  });

  test('returns empty array for string passed into number array', () => {
    const ini = `[Test]
IgnoredItems=It_Bradley_SlaveList;It_Brandon_Name
; List of ignored items
; array, arrayType:number, It_Bradley_SlaveList;`;

    expect(parseConfig(ini, 'Config')).toHaveLength(0);
  });

  test('returns empty array for string passed into number array', () => {
    const ini = `[Test]
IgnoredItems=It_Bradley_SlaveList;It_Brandon_Name
; List of ignored items
; array, arrayType:number, It_Bradley_SlaveList;`;

    expect(parseConfig(ini, 'Config')).toHaveLength(0);
  });

  test('returns boolean object', () => {
    const ini = `[Test]
AllowWithItemInHands=false
; Allows item interaction with hands
; boolean, false`;

    const expectedOutput = JSON.parse(
      '[{"name":"Test","options":[{"name":"AllowWithItemInHands","description":"Allows item interaction with hands","value":false,"type":"boolean","defaultValue":false}]}]',
    );

    expect(parseConfig(ini, 'Config')).toMatchObject(expectedOutput);
  });

  test('returns empty array for incorrect value', () => {
    const ini = `[Test]
AllowWithItemInHands=faslse
; Allows item interaction with hands
; boolean, false`;

    expect(parseConfig(ini, 'Config')).toHaveLength(0);
  });

  test('returns empty array for incorrect default value', () => {
    const ini = `[Test]
AllowWithItemInHands=false
; Allows item interaction with hands
; boolean, falsee`;

    expect(parseConfig(ini, 'Config')).toHaveLength(0);
  });

  test('returns key object', () => {
    const ini = `[Test]
AutoLootToggleHotkey=SEMICOLON
;lorem ipsum
; key,  SEMICOLON`;

    const expectedOutput = JSON.parse(
      '[{"name":"Test","options":[{"name":"AutoLootToggleHotkey","description":"lorem ipsum","value":"SEMICOLON","type":"key","defaultValue":"SEMICOLON"}]}]',
    );

    expect(parseConfig(ini, 'Config')).toMatchObject(expectedOutput);
  });

  test('returns empty array for wrong type name', () => {
    const ini = `[Test]
AutoLootToggleHotkey=SEMICOLON
;lorem ipsum
; kwey,  SEMICOLON`;

    expect(parseConfig(ini, 'Config')).toHaveLength(0);
  });
});

describe('loadIniConfiguration', () => {
  test('returns 2 sections', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
        'ini\\eCDELocator.ini': `[Main]
eCDELocatorToggleHotkey=Y
; lorem
; key, Y
[Filter]
ShowItemMeleeWeapon=false
; lorem
; boolean, false`,
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(loadIniConfiguration('eCDELocator.ini')).resolves.toHaveLength(2);
  });

  test('throws an error for file not present in config', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: [],
        }),
        'ini\\eCDELocator.ini': `[Main]
eCDELocatorToggleHotkey=Y
; lorem
; key, Y
[Filter]
ShowItemMeleeWeapon=false
; lorem
; boolean, false`,
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(loadIniConfiguration('eCDELocator.ini')).rejects.toThrowError();
  });

  test('throws an error for non existing file', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(loadIniConfiguration('eCDELocator.ini')).rejects.toThrowError();
  });

  test('returns 1 section for option with wrong data', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
        'ini\\eCDELocator.ini': `[Main]
eCDELocatorToggleHotkey=Y
; lorem
; kdey, Y
[Filter]
ShowItemMeleeWeapon=false
; lorem
; boolean, false`,
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(loadIniConfiguration('eCDELocator.ini')).resolves.toHaveLength(1);
  });
});

describe('getAllIniNames', () => {
  test('returns 3 ini file names', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: [
            'E:\\Games\\Gothic 3\\ini\\eCDELocator.ini',
            'E:\\Games\\Gothic 3\\ini\\floatingdamage.ini',
            'E:\\Games\\Gothic 3\\ini\\G3Fixes.ini',
          ],
        }),
        'ini\\eCDELocator.ini': `[Main]
eCDELocatorToggleHotkey=Y
; lorem
; key, Y`,
        'ini\\floatingdamage.ini': `[Main]
ShowOnlyPlayerDamage=true
; Show damage dealt only by player? true/false
; boolean, true`,
        'ini\\G3Fixes.ini': `[Main]
CompanionAutoDefendHotkey=APOSTROPHE
; Lorem ipsum dolor sit amet
; key, APOSTROPHE`,
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(getAllIniNames()).resolves.toHaveLength(3);
  });

  test('returns 1 ini file name for one empty file', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: [
            'E:\\Games\\Gothic 3\\ini\\eCDELocator.ini',
            'E:\\Games\\Gothic 3\\ini\\floatingdamage.ini',
          ],
        }),
        'ini\\eCDELocator.ini': '',
        'ini\\floatingdamage.ini': `[Main]
ShowOnlyPlayerDamage=true
; Show damage dealt only by player? true/false
; boolean, true`,
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(getAllIniNames()).resolves.toHaveLength(1);
  });

  test('returns empty array for missing paths in config', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: [],
        }),
        'ini\\eCDELocator.ini': '',
        'ini\\floatingdamage.ini': `[Main]
ShowOnlyPlayerDamage=true
; Show damage dealt only by player? true/false
; boolean, true`,
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(getAllIniNames()).resolves.toHaveLength(0);
  });
});

describe('validateIniFile', () => {
  test('returns true for valid ini file', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
        'ini\\eCDELocator.ini': `[Main]
eCDELocatorToggleHotkey=Y
; lorem
; key, Y
[Filter]
ShowItemMeleeWeapon=false
; lorem
; boolean, false`,
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(validateIniFile('eCDELocator.ini')).resolves.toBeTruthy();
  });

  test('returns false for ini witout any sections', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
        'ini\\eCDELocator.ini': `
eCDELocatorToggleHotkey=Y
; lorem
; kesy, Y
ShowItemMeleeWeapon=false
; lorem
; booleaan, false`,
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(validateIniFile('eCDELocator.ini')).resolves.toBeFalsy();
  });

  test('returns false for ini witout any options', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
        'ini\\eCDELocator.ini': '[Main]',
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(validateIniFile('eCDELocator.ini')).resolves.toBeFalsy();
  });

  test('returns false for empty ini', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
        'ini\\eCDELocator.ini': '',
      },
      'E:\\Games\\Gothic 3',
    );

    await expect(validateIniFile('eCDELocator.ini')).resolves.toBeFalsy();
  });
});

describe('saveIniConfiguration', () => {
  test('saves ini overwriting all supported types', async () => {
    const ini = `[Main]
FontName=Comic Sans MS
; lorem
; string, Comic Sans MS
FontSize=16
; lorem
; number, 16
; 0|60

FontBold=false
; lorem
; boolean, false

[Mode]
Mode=Default
; Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]
; mode, Default
; Default|NoThreshold|Hardcore

[Thresholds]
STR=200;300;400
; lorem
; array, arrayType:number, 200;300;400

[QuickLoot]
IgnoredItems=It_Bradley_SlaveList;It_Brandon_Name
; List of ignored items
; array, arrayType:string, It_Bradley_SlaveList;
AutoLootToggleHotkey=SEMICOLON
;lorem ipsum
; key,  SEMICOLON
AutoLootIconPosTopX=98.500000
; lorem ipsum
; number,  98.5
; 1|300|0.5`;
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
        'ini\\eCDELocator.ini': ini,
      },
      'E:\\Games\\Gothic 3',
    );

    const input = JSON.parse(
      '[{"name":"Main","options":[{"name":"FontName","description":"lorem","value":"Comic Sans MC","type":"string","defaultValue":"Comic Sans MS"},{"name":"FontSize","description":"lorem","value":26,"type":"number","defaultValue":16,"ranges":[0,60]},{"name":"FontBold","description":"lorem","value":true,"type":"boolean","defaultValue":false}]},{"name":"Mode","options":[{"name":"Mode","description":"Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]","value":"NoThreshold","type":"mode","defaultValue":"Default","modes":["Default","NoThreshold","Hardcore"]}]},{"name":"Thresholds","options":[{"name":"STR","description":"lorem","value":[200,500],"type":"arrayType:number","defaultValue":[200,300,400]}]},{"name":"QuickLoot","options":[{"name":"IgnoredItems","description":"List of ignored items","value":["It_Bradley_SlaveList","It_Item"],"type":"arrayType:string","defaultValue":["It_Bradley_SlaveList"]},{"name":"AutoLootToggleHotkey","description":"lorem ipsum","value":"G","type":"key","defaultValue":"SEMICOLON"},{"name":"AutoLootIconPosTopX","description":"lorem ipsum","value":92.5,"type":"number","defaultValue":98.5,"ranges":[1,300,0.5]}]}]',
    );
    await saveIniConfiguration(input, 'eCDELocator.ini');

    const updatedIni = fs.readFileSync('E:\\Games\\Gothic 3\\ini\\eCDELocator.ini', UTF8);

    const expectedIni = `[Main]
FontName=Comic Sans MC
; lorem
; string, Comic Sans MS
FontSize=26
; lorem
; number, 16
; 0|60

FontBold=true
; lorem
; boolean, false

[Mode]
Mode=NoThreshold
; Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]
; mode, Default
; Default|NoThreshold|Hardcore

[Thresholds]
STR=200;500
; lorem
; array, arrayType:number, 200;300;400

[QuickLoot]
IgnoredItems=It_Bradley_SlaveList;It_Item
; List of ignored items
; array, arrayType:string, It_Bradley_SlaveList;
AutoLootToggleHotkey=G
;lorem ipsum
; key,  SEMICOLON
AutoLootIconPosTopX=92.5
; lorem ipsum
; number,  98.5
; 1|300|0.5`;

    expect(updatedIni).toBe(expectedIni);
  });

  test('throws error for missing config file', async () => {
    const ini = `[Main]
FontName=Comic Sans MS
; lorem
; string, Comic Sans MS
FontSize=16
; lorem
; number, 16
; 0|60

FontBold=false
; lorem
; boolean, false

[Mode]
Mode=Default
; Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]
; mode, Default
; Default|NoThreshold|Hardcore

[Thresholds]
STR=200;300;400
; lorem
; array, arrayType:number, 200;300;400

[QuickLoot]
IgnoredItems=It_Bradley_SlaveList;It_Brandon_Name
; List of ignored items
; array, arrayType:string, It_Bradley_SlaveList;
AutoLootToggleHotkey=SEMICOLON
;lorem ipsum
; key,  SEMICOLON
AutoLootIconPosTopX=98.500000
; lorem ipsum
; number,  98.5
; 1|300|0.5`;
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        'ini\\eCDELocator.ini': ini,
      },
      'E:\\Games\\Gothic 3',
    );

    const input = JSON.parse(
      '[{"name":"Main","options":[{"name":"FontName","description":"lorem","value":"Comic Sans MC","type":"string","defaultValue":"Comic Sans MS"},{"name":"FontSize","description":"lorem","value":26,"type":"number","defaultValue":16,"ranges":[0,60]},{"name":"FontBold","description":"lorem","value":true,"type":"boolean","defaultValue":false}]},{"name":"Mode","options":[{"name":"Mode","description":"Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]","value":"NoThreshold","type":"mode","defaultValue":"Default","modes":["Default","NoThreshold","Hardcore"]}]},{"name":"Thresholds","options":[{"name":"STR","description":"lorem","value":[200,500],"type":"arrayType:number","defaultValue":[200,300,400]}]},{"name":"QuickLoot","options":[{"name":"IgnoredItems","description":"List of ignored items","value":["It_Bradley_SlaveList","It_Item"],"type":"arrayType:string","defaultValue":["It_Bradley_SlaveList"]},{"name":"AutoLootToggleHotkey","description":"lorem ipsum","value":"G","type":"key","defaultValue":"SEMICOLON"},{"name":"AutoLootIconPosTopX","description":"lorem ipsum","value":92.5,"type":"number","defaultValue":98.5,"ranges":[1,300,0.5]}]}]',
    );

    await expect(saveIniConfiguration(input, 'eCDELocator.ini')).rejects.toThrowError();
  });

  test('throws error for missing ini file', async () => {
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
      },
      'E:\\Games\\Gothic 3',
    );

    const input = JSON.parse(
      '[{"name":"Main","options":[{"name":"FontName","description":"lorem","value":"Comic Sans MC","type":"string","defaultValue":"Comic Sans MS"},{"name":"FontSize","description":"lorem","value":26,"type":"number","defaultValue":16,"ranges":[0,60]},{"name":"FontBold","description":"lorem","value":true,"type":"boolean","defaultValue":false}]},{"name":"Mode","options":[{"name":"Mode","description":"Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]","value":"NoThreshold","type":"mode","defaultValue":"Default","modes":["Default","NoThreshold","Hardcore"]}]},{"name":"Thresholds","options":[{"name":"STR","description":"lorem","value":[200,500],"type":"arrayType:number","defaultValue":[200,300,400]}]},{"name":"QuickLoot","options":[{"name":"IgnoredItems","description":"List of ignored items","value":["It_Bradley_SlaveList","It_Item"],"type":"arrayType:string","defaultValue":["It_Bradley_SlaveList"]},{"name":"AutoLootToggleHotkey","description":"lorem ipsum","value":"G","type":"key","defaultValue":"SEMICOLON"},{"name":"AutoLootIconPosTopX","description":"lorem ipsum","value":92.5,"type":"number","defaultValue":98.5,"ranges":[1,300,0.5]}]}]',
    );

    await expect(saveIniConfiguration(input, 'eCDELocator.ini')).rejects.toThrowError();
  });

  test('throws error for missing ini in config', async () => {
    const ini = `[Main]
    FontName=Comic Sans MS
    ; lorem
    ; string, Comic Sans MS
    FontSize=16
    ; lorem
    ; number, 16
    ; 0|60
    
    FontBold=false
    ; lorem
    ; boolean, false
    
    [Mode]
    Mode=Default
    ; Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]
    ; mode, Default
    ; Default|NoThreshold|Hardcore
    
    [Thresholds]
    STR=200;300;400
    ; lorem
    ; array, arrayType:number, 200;300;400
    
    [QuickLoot]
    IgnoredItems=It_Bradley_SlaveList;It_Brandon_Name
    ; List of ignored items
    ; array, arrayType:string, It_Bradley_SlaveList;
    AutoLootToggleHotkey=SEMICOLON
    ;lorem ipsum
    ; key,  SEMICOLON
    AutoLootIconPosTopX=98.500000
    ; lorem ipsum
    ; number,  98.5
    ; 1|300|0.5`;
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: [],
        }),
        'ini\\eCDELocator.ini': ini,
      },
      'E:\\Games\\Gothic 3',
    );

    const input = JSON.parse(
      '[{"name":"Main","options":[{"name":"FontName","description":"lorem","value":"Comic Sans MC","type":"string","defaultValue":"Comic Sans MS"},{"name":"FontSize","description":"lorem","value":26,"type":"number","defaultValue":16,"ranges":[0,60]},{"name":"FontBold","description":"lorem","value":true,"type":"boolean","defaultValue":false}]},{"name":"Mode","options":[{"name":"Mode","description":"Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]","value":"NoThreshold","type":"mode","defaultValue":"Default","modes":["Default","NoThreshold","Hardcore"]}]},{"name":"Thresholds","options":[{"name":"STR","description":"lorem","value":[200,500],"type":"arrayType:number","defaultValue":[200,300,400]}]},{"name":"QuickLoot","options":[{"name":"IgnoredItems","description":"List of ignored items","value":["It_Bradley_SlaveList","It_Item"],"type":"arrayType:string","defaultValue":["It_Bradley_SlaveList"]},{"name":"AutoLootToggleHotkey","description":"lorem ipsum","value":"G","type":"key","defaultValue":"SEMICOLON"},{"name":"AutoLootIconPosTopX","description":"lorem ipsum","value":92.5,"type":"number","defaultValue":98.5,"ranges":[1,300,0.5]}]}]',
    );

    await expect(saveIniConfiguration(input, 'eCDELocator.ini')).rejects.toThrowError();
  });

  test('throws error not try to save no data', async () => {
    const ini = `[Main]
FontName=Comic Sans MS
; lorem
; string, Comic Sans MS
FontSize=16
; lorem
; number, 16
; 0|60

FontBold=false
; lorem
; boolean, false

[Mode]
Mode=Default
; Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]
; mode, Default
; Default|NoThreshold|Hardcore

[Thresholds]
STR=200;300;400
; lorem
; array, arrayType:number, 200;300;400

[QuickLoot]
IgnoredItems=It_Bradley_SlaveList;It_Brandon_Name
; List of ignored items
; array, arrayType:string, It_Bradley_SlaveList;
AutoLootToggleHotkey=SEMICOLON
;lorem ipsum
; key,  SEMICOLON
AutoLootIconPosTopX=98.500000
; lorem ipsum
; number,  98.5
; 1|300|0.5`;
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
        'ini\\eCDELocator.ini': ini,
      },
      'E:\\Games\\Gothic 3',
    );

    const input = [];
    await expect(saveIniConfiguration(input, 'eCDELocator.ini')).rejects.toThrowError();
  });

  test('ini stays the same for saving with no changes', async () => {
    const ini = `[Main]
FontName=Comic Sans MS
; lorem
; string, Comic Sans MS
FontSize=16
; lorem
; number, 16
; 0|60

FontBold=false
; lorem
; boolean, false

[Mode]
Mode=Default
; Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]
; mode, Default
; Default|NoThreshold|Hardcore

[Thresholds]
STR=200;300;400
; lorem
; array, arrayType:number, 200;300;400

[QuickLoot]
IgnoredItems=It_Bradley_SlaveList;It_Brandon_Name
; List of ignored items
; array, arrayType:string, It_Bradley_SlaveList;
AutoLootToggleHotkey=SEMICOLON
;lorem ipsum
; key,  SEMICOLON
AutoLootIconPosTopX=98.5
; lorem ipsum
; number,  98.5
; 1|300|0.5`;
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
        'ini\\eCDELocator.ini': ini,
      },
      'E:\\Games\\Gothic 3',
    );

    const input = JSON.parse(
      '[{"name":"Main","options":[{"name":"FontName","description":"lorem","value":"Comic Sans MS","type":"string","defaultValue":"Comic Sans MS"},{"name":"FontSize","description":"lorem","value":16,"type":"number","defaultValue":16,"ranges":[0,60]},{"name":"FontBold","description":"lorem","value":false,"type":"boolean","defaultValue":false}]},{"name":"Mode","options":[{"name":"Mode","description":"Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]","value":"Default","type":"mode","defaultValue":"Default","modes":["Default","NoThreshold","Hardcore"]}]},{"name":"Thresholds","options":[{"name":"STR","description":"lorem","value":[200,300,400],"type":"arrayType:number","defaultValue":[200,300,400]}]},{"name":"QuickLoot","options":[{"name":"IgnoredItems","description":"List of ignored items","value":["It_Bradley_SlaveList","It_Brandon_Name"],"type":"arrayType:string","defaultValue":["It_Bradley_SlaveList"]},{"name":"AutoLootToggleHotkey","description":"lorem ipsum","value":"SEMICOLON","type":"key","defaultValue":"SEMICOLON"},{"name":"AutoLootIconPosTopX","description":"lorem ipsum","value":98.5,"type":"number","defaultValue":98.5,"ranges":[1,300,0.5]}]}]',
    );

    await saveIniConfiguration(input, 'eCDELocator.ini');
    const updatedIni = fs.readFileSync('E:\\Games\\Gothic 3\\ini\\eCDELocator.ini', UTF8);

    expect(updatedIni).toBe(ini);
  });

  test('ini doesnt overwrite commented informations', async () => {
    const ini = `[Main]
FontName=Comic Sans MS
; lorem
; string, Comic Sans MS
FontSize=16
; lorem
; number, 16
; 0|60

FontBold=false
; lorem
; boolean, false

[Mode]
Mode=Default
; Default - Standard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]
; mode, Default
; Default|NoThreshold|Hardcore

[Thresholds]
STR=200;300;400
; lorem
; array, arrayType:number, 200;300;400

[QuickLoot]
IgnoredItems=It_Bradley_SlaveList;It_Brandon_Name
; List of ignored items
; array, arrayType:string, It_Bradley_SlaveList;
AutoLootToggleHotkey=SEMICOLON
;lorem ipsum
; key,  SEMICOLON
AutoLootIconPosTopX=98.5
; lorem ipsum
; number,  98.5
; 1|300|0.5`;
    vol.fromJSON(
      {
        'Gothic3.exe': '{}',
        [path.join(baseDir, 'config.json')]: JSON.stringify({
          gothicPath: 'E:\\Games\\Gothic 3',
          modsPath: 'E:\\Games\\Gothic 3\\mods',
          language: 'pl',
          installedMods: [],
          filesCreated: ['E:\\Games\\Gothic 3\\ini\\eCDELocator.ini'],
        }),
        'ini\\eCDELocator.ini': ini,
      },
      'E:\\Games\\Gothic 3',
    );

    const input = JSON.parse(
      '[{"name":"Main","options":[{"name":"FontName","description":"loremeweasdasdasd","value":"Comic Sans MS","type":"string","defaultValue":"Comic Sans MC"},{"name":"FontSize","description":"lorem","value":16,"type":"number","defaultValue":16233,"ranges":[0,6023]},{"name":"FontBold","description":"lorem24124","value":false,"type":"boolean","defaultValue":false}]},{"name":"Mode","options":[{"name":"Mode","description":"Default - asdasdStandard threshold for STR/DEX/INT at 250 NoThreshold - Removes the threshold at 250 Hardcore - New thresholds as configured in [Thresholds]","value":"Default","type":"mode","defaultValue":"Defaultter","modes":["Default","NoThreshold","Hardcore"]}]},{"name":"Thresholds","options":[{"name":"STR","description":"lorem","value":[200,300,400],"type":"arrayType:number","defaultValue":[200,300,400,500]}]},{"name":"QuickLoot","options":[{"name":"IgnoredItems","description":"List of ignored items","value":["It_Bradley_SlaveList","It_Brandon_Name"],"type":"arrayType:string","defaultValue":["It_Bradley_SlaveList"]},{"name":"AutoLootToggleHotkey","description":"lorem ipsum","value":"SEMICOLON","type":"key","defaultValue":"SEMICOLON"},{"name":"AutoLootIconPosTopX","description":"lorem ipsum","value":98.5,"type":"number","defaultValue":98.5,"ranges":[1,300,0.5]}]}]',
    );

    await saveIniConfiguration(input, 'eCDELocator.ini');
    const updatedIni = fs.readFileSync('E:\\Games\\Gothic 3\\ini\\eCDELocator.ini', UTF8);

    expect(updatedIni).toBe(ini);
  });
});
