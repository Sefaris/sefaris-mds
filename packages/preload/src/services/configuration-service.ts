import { ipcRenderer } from 'electron';
import type { AppConfiguration } from '../../../../interfaces/AppConfiguration';
import { LANGUAGE_SETTINGS, UTF8 } from '../../../../utils/constants';
import * as fs from 'fs';
import * as path from 'path';
import { loggerError, loggerInfo } from './logger-service';
import { getMessage } from '../../../../utils/messages';
import { showAlert } from './alert-service';
import { ConfigurationError } from '../../../../Errors/ConfigurationError';

const configurationFile = 'config.json';

export async function selectGameFolder(): Promise<string> {
  return await ipcRenderer.invoke('open-folder-dialog-game');
}

export async function selectFolder(): Promise<string> {
  return await ipcRenderer.invoke('open-folder-dialog');
}

export async function saveConfiguration(config: AppConfiguration) {
  try {
    if (!config.modsPath) {
      config.modsPath = path.join(config.gothicPath, 'Mods');
    }
    if (!isValidConfiguration(config)) {
      throw new ConfigurationError(getMessage('INVALID_CONFIGURATION'));
    }
    fs.writeFileSync(path.resolve(configurationFile), JSON.stringify(config, null, 4));
    loggerInfo(getMessage('CONFIGURATION_SAVED'));
  } catch (error) {
    if (error instanceof Error) {
      loggerError(error.message);
      showAlert('modal.error', error.message, 'error');
    }
  }
}

export async function loadConfiguration() {
  if (!fs.existsSync(path.resolve(configurationFile))) {
    throw new ConfigurationError(getMessage('MISSING_CONFIGURATION'));
  }
  const config: AppConfiguration = JSON.parse(
    fs.readFileSync(path.resolve(configurationFile), UTF8),
  );
  if (!isValidConfiguration(config)) {
    throw new ConfigurationError(getMessage('INVALID_CONFIGURATION'));
  }
  return config;
}

export function isValidConfiguration(config: AppConfiguration) {
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

  if (!isGothicPathValid(config)) return false;

  return (
    typeof config.gothicPath === 'string' &&
    typeof config.modsPath === 'string' &&
    typeof config.ignoreDependencies === 'boolean' &&
    typeof config.ignoreIncompatible === 'boolean' &&
    LANGUAGE_SETTINGS.find(item => item.code === config.language) &&
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
