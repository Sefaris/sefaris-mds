import { expect, test, vi, beforeEach, describe } from 'vitest';
import { vol } from 'memfs';
import { parseConfig } from './ini-service';
// import path from 'path';

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

// const baseDir = path.resolve();

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

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(parseConfig(ini, 'Config')).toMatchObject(expectedOutput);
    expect(consoleErrorMock).toHaveBeenCalled();
    consoleErrorMock.mockRestore();
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

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(parseConfig(ini, 'Config')).toMatchObject([]);
    expect(consoleErrorMock).toHaveBeenCalled();
    consoleErrorMock.mockRestore();
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

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(parseConfig(ini, 'Config')).toHaveLength(0);
    expect(consoleErrorMock).toHaveBeenCalled();
    consoleErrorMock.mockRestore();
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
