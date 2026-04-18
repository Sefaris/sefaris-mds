import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import { toRelative, toAbsolute } from '../../packages/preload/src/services/file-service';

beforeEach(() => {
  vi.mock('path', async () => {
    return await vi.importActual('path');
  });

  vi.mock('../../packages/preload/src/services/logger-service', () => {
    return {
      loggerInfo: vi.fn(),
      loggerError: vi.fn(),
      loggerWarn: vi.fn(),
    };
  });

  vi.mock('electron', () => ({
    ipcRenderer: { invoke: vi.fn() },
  }));

  vi.mock('winreg', () => ({
    default: vi.fn(),
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('toRelative', () => {
  test('returns relative path with forward-slash separator', () => {
    const result = toRelative('E:\\Games\\Gothic 3', 'E:\\Games\\Gothic 3\\Data\\gui.mod');
    expect(result).toBe('Data/gui.mod');
  });

  test('handles trailing slashes in gothicPath', () => {
    const result = toRelative('E:\\Games\\Gothic 3\\', 'E:\\Games\\Gothic 3\\ini\\file.ini');
    expect(result).toBe('ini/file.ini');
  });

  test('returns empty string for the same path', () => {
    expect(toRelative('E:\\Games\\Gothic 3', 'E:\\Games\\Gothic 3')).toBe('');
  });

  test('handles UTF-8 and spaces in file name', () => {
    const result = toRelative('E:\\Games\\Gothic 3', 'E:\\Games\\Gothic 3\\Data\\Łuczników.mod');
    expect(result).toBe('Data/Łuczników.mod');
  });
});

describe('toAbsolute', () => {
  test('joins gothicPath with relative path', () => {
    const result = toAbsolute('E:\\Games\\Gothic 3', 'Data/gui.mod');
    expect(result).toBe(path.join('E:\\Games\\Gothic 3', 'Data', 'gui.mod'));
  });

  test('accepts back-slash separators', () => {
    const result = toAbsolute('E:\\Games\\Gothic 3', 'Data\\infos.mod');
    expect(result).toBe(path.join('E:\\Games\\Gothic 3', 'Data', 'infos.mod'));
  });
});
