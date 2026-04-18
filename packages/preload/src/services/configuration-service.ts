import { ipcRenderer } from 'electron';
import type { AppConfiguration } from '../../../../interfaces/AppConfiguration';
import {
  CONFIG_FILE,
  DOCUMENTS_GOTHIC_DIRECTORY,
  LANGUAGE_SETTINGS,
  MODS_DIRECTORY,
  UTF8,
} from '../../../../utils/constants';
import * as fs from 'fs';
import * as path from 'path';
import { loggerError, loggerInfo, loggerWarn } from './logger-service';
import { getMessage } from '../../../../utils/messages';
import { showAlert } from './alert-service';
import { ConfigurationError } from '../../../../Errors/ConfigurationError';
import {
  ensureDirectory,
  findInstalledModFiles,
  getDocumentsPath,
  toAbsolute,
} from './file-service';

export async function selectGameFolder(): Promise<string> {
  return await ipcRenderer.invoke('open-folder-dialog-game');
}

export async function selectFolder(): Promise<string> {
  return await ipcRenderer.invoke('open-folder-dialog');
}

export async function saveConfiguration(config: AppConfiguration) {
  try {
    if (!config.modsPath) {
      config.modsPath = path.join(config.gothicPath, MODS_DIRECTORY);
    }
    if (!isValidConfiguration(config)) {
      throw new ConfigurationError(getMessage('INVALID_CONFIGURATION'));
    }
    const configDirPath = path.join(await getDocumentsPath(), DOCUMENTS_GOTHIC_DIRECTORY);
    const configPath = path.join(configDirPath, CONFIG_FILE);
    ensureDirectory(configDirPath);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    loggerInfo(getMessage('CONFIGURATION_SAVED'));
  } catch (error) {
    if (error instanceof Error) {
      loggerError(error.message);
      showAlert('modal.error', error.message, 'error');
    }
  }
}

export async function loadConfiguration(): Promise<AppConfiguration | null> {
  const configPath = path.join(await getDocumentsPath(), DOCUMENTS_GOTHIC_DIRECTORY, CONFIG_FILE);

  if (!fs.existsSync(configPath)) {
    throw new ConfigurationError(getMessage('MISSING_CONFIGURATION'));
  }

  let parsed: AppConfiguration;
  try {
    parsed = JSON.parse(fs.readFileSync(configPath, UTF8));
  } catch {
    backupConfiguration(configPath);
    throw new ConfigurationError(getMessage('INVALID_CONFIGURATION'));
  }

  if (!isValidConfigurationStructure(parsed)) {
    backupConfiguration(configPath);
    throw new ConfigurationError(getMessage('INVALID_CONFIGURATION'));
  }

  if (!isGothicPathValid(parsed)) {
    throw new ConfigurationError(getMessage('INVALID_GAME_PATH'), parsed);
  }

  migrateFilesCreated(parsed);
  return parsed;
}

/**
 * Variant of `loadConfiguration` that does NOT validate `gothicPath`. Used by
 * the renderer recovery flow to recover the previous configuration when the
 * game folder has moved (so we can preserve `installedMods`, `filesCreated`,
 * presets and settings while updating only `gothicPath`).
 *
 * Throws `MISSING_CONFIGURATION` or `INVALID_CONFIGURATION` for the same cases
 * as `loadConfiguration`. Does not run `migrateFilesCreated` because the
 * gothicPath may be wrong; migration runs once a valid path is set.
 */
export async function loadConfigurationRaw(): Promise<AppConfiguration> {
  const configPath = path.join(await getDocumentsPath(), DOCUMENTS_GOTHIC_DIRECTORY, CONFIG_FILE);

  if (!fs.existsSync(configPath)) {
    throw new ConfigurationError(getMessage('MISSING_CONFIGURATION'));
  }

  let parsed: AppConfiguration;
  try {
    parsed = JSON.parse(fs.readFileSync(configPath, UTF8));
  } catch {
    throw new ConfigurationError(getMessage('INVALID_CONFIGURATION'));
  }

  if (!isValidConfigurationStructure(parsed)) {
    throw new ConfigurationError(getMessage('INVALID_CONFIGURATION'));
  }

  return parsed;
}

/**
 * Creates a `<config>.bak` copy of the existing config file before it gets
 * overwritten by a fresh one. Single-slot retention — the previous backup is
 * overwritten. Failures are logged but never thrown (best-effort).
 */
export function backupConfiguration(configPath: string): void {
  try {
    if (!fs.existsSync(configPath)) return;
    const backupPath = `${configPath}.bak`;
    fs.copyFileSync(configPath, backupPath);
    loggerInfo(getMessage('CONFIG_BACKUP_CREATED', { path: backupPath }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    loggerWarn(getMessage('CONFIG_BACKUP_FAILED', { error: message }));
  }
}

/**
 * Migracja `filesCreated` z absolutnych ścieżek do relatywnych względem `gothicPath`.
 * - Wpisy już relatywne są normalizowane do separatora `/`.
 * - Absolutne wpisy należące do `gothicPath` → konwertowane na relatywne.
 * - Absolutne wpisy spoza `gothicPath` → odrzucane (z warningiem do logu, bez kasowania plików).
 * Mutuje obiekt in-place; zmiany trafią na dysk przy najbliższym `saveConfiguration`.
 */
export function migrateFilesCreated(config: AppConfiguration): void {
  if (!config.filesCreated.length) return;
  const gothicPath = path.resolve(config.gothicPath);
  const migrated: string[] = [];
  const dropped: string[] = [];

  for (const entry of config.filesCreated) {
    if (path.isAbsolute(entry)) {
      const normalized = path.resolve(entry);
      const rel = path.relative(gothicPath, normalized);
      if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
        dropped.push(entry);
        continue;
      }
      migrated.push(rel.split(path.sep).join('/'));
    } else {
      migrated.push(entry.split(/[\\/]/).join('/'));
    }
  }

  if (dropped.length) {
    loggerWarn(
      getMessage('CONFIG_FILES_CREATED_DROPPED', {
        count: dropped.length.toString(),
        files: dropped.join(', '),
      }),
    );
  }
  config.filesCreated = migrated;
}

export function isValidConfiguration(config: AppConfiguration) {
  if (!isValidConfigurationStructure(config)) return false;
  if (!isGothicPathValid(config)) return false;
  return true;
}

/**
 * Structural validation of the configuration object — checks required keys,
 * allowed keys, types and language code. Does NOT verify whether
 * `gothicPath` actually points to a Gothic 3 installation; that check lives in
 * `isGothicPathValid` and is performed separately so the renderer can offer a
 * "select new game folder" recovery flow without losing the rest of the config.
 */
export function isValidConfigurationStructure(config: AppConfiguration) {
  const requiredKeys = [
    'gothicPath',
    'modsPath',
    'language',
    'installedMods',
    'filesCreated',
    'ignoreDependencies',
    'ignoreIncompatible',
  ];
  const optionalKeys = ['preset'];
  const configKeys = Object.keys(config);

  if (!requiredKeys.every(key => configKeys.includes(key))) {
    return false;
  }

  const allowedKeys = [...requiredKeys, ...optionalKeys];
  if (!configKeys.every(key => allowedKeys.includes(key))) {
    return false;
  }

  return (
    typeof config.gothicPath === 'string' &&
    typeof config.modsPath === 'string' &&
    typeof config.ignoreDependencies === 'boolean' &&
    typeof config.ignoreIncompatible === 'boolean' &&
    !!LANGUAGE_SETTINGS.find(item => item.code === config.language) &&
    Array.isArray(config.installedMods) &&
    Array.isArray(config.filesCreated) &&
    (config.preset === undefined || typeof config.preset === 'string')
  );
}
export function isGothicPathValid(param: AppConfiguration | string): boolean {
  if (typeof param === 'string') {
    return fs.existsSync(path.join(param, 'Gothic3.exe'));
  } else {
    return fs.existsSync(path.join(param.gothicPath, 'Gothic3.exe'));
  }
}

export async function getAlreadyInstalledFiles() {
  const config = await loadConfiguration();
  if (!config) throw new ConfigurationError(getMessage('MISSING_CONFIGURATION'));
  const dataPath = path.join(config.gothicPath, 'Data');
  return findInstalledModFiles(dataPath);
}

export async function installedFilesExist() {
  const config = await loadConfiguration();
  if (!config) throw new ConfigurationError(getMessage('MISSING_CONFIGURATION'));
  if (!config.filesCreated.length) return true;
  config.filesCreated.forEach(file => {
    if (!fs.existsSync(toAbsolute(config.gothicPath, file))) return false;
  });
  return true;
}
