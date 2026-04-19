import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import os from 'os';
import * as fs from 'fs';

// Force a deterministic exe path so the logger writes into a temp directory
// rather than the actual system Electron path.
const tmpExeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sefaris-logger-'));
const tmpExePath = path.join(tmpExeDir, 'fake-app.exe');

beforeEach(() => {
  vi.resetModules();
  Object.defineProperty(process, 'execPath', { value: tmpExePath, configurable: true });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getLogsDirPath', () => {
  it('resolves to <exeDir>/logs', async () => {
    const { getLogsDirPath } = await import('../../packages/preload/src/services/logger-service');
    expect(getLogsDirPath()).toBe(path.join(tmpExeDir, 'logs'));
  });
});

describe('logger-service init', () => {
  it('creates the logs directory next to the application executable', async () => {
    const { getLogsDirPath } = await import('../../packages/preload/src/services/logger-service');
    expect(fs.existsSync(getLogsDirPath())).toBe(true);
  });

  it('does not throw when invoked synchronously after import', async () => {
    const { loggerInfo, loggerError, loggerWarn } =
      await import('../../packages/preload/src/services/logger-service');
    expect(() => loggerInfo('sync info')).not.toThrow();
    expect(() => loggerError('sync error')).not.toThrow();
    expect(() => loggerWarn('sync warn')).not.toThrow();
  });

  it('falls back to a console-only logger when the file transport cannot be created', async () => {
    // Point execPath into a path that cannot be created (a file masquerading
    // as a parent directory) to force the file transport to fail.
    const blockingFile = path.join(tmpExeDir, 'blocking-file');
    fs.writeFileSync(blockingFile, 'x');
    Object.defineProperty(process, 'execPath', {
      value: path.join(blockingFile, 'app.exe'),
      configurable: true,
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { loggerInfo } = await import('../../packages/preload/src/services/logger-service');

    expect(() => loggerInfo('still works')).not.toThrow();
    consoleErrorSpy.mockRestore();
  });
});
