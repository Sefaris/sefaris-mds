import { ipcRenderer } from 'electron';
import type { AppConfiguration } from '../../../../interfaces/AppConfiguration';
import { LANGUAGE_SETTINGS, UTF8 } from '../../../../utils/constants';
import * as fs from 'fs';
import * as path from 'path';

const configurationFile = 'config.json';

export async function selectGameFolder(): Promise<string> {
  return await ipcRenderer.invoke('open-folder-dialog');
}

export async function saveConfiguration(config: AppConfiguration) {
  try {
    if (!config.modsPath) {
      config.modsPath = path.join(config.gothicPath, 'Mods');
    }
    if (!isValidConfiguration(config)) {
      return;
    }
    fs.writeFileSync(path.resolve(configurationFile), JSON.stringify(config, null, 4));
  } catch (error) {
    alert(error);
  }
}

export async function loadConfiguration(): Promise<AppConfiguration | null> {
  if (!fs.existsSync(path.resolve(configurationFile))) {
    return null;
  }
  const config = JSON.parse(fs.readFileSync(path.resolve(configurationFile), UTF8));
  if (!isValidConfiguration(config)) {
    return null;
  }
  return config;
}

export function isValidConfiguration(config: AppConfiguration) {
  const requiredKeys = ['gothicPath', 'modsPath', 'language', 'installedMods', 'filesCreated'];
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
    LANGUAGE_SETTINGS.find(item => item.code === config.language) &&
    Array.isArray(config.installedMods) &&
    Array.isArray(config.filesCreated) &&
    (config.preset === undefined || typeof config.preset === 'string') // Check if preset is either undefined or a string
  );
}
export function isGothicPathValid(param: AppConfiguration | string): boolean {
  if (typeof param === 'string') {
    return fs.existsSync(path.join(param, 'Gothic3.exe'));
  } else {
    return fs.existsSync(path.join(param.gothicPath, 'Gothic3.exe'));
  }
}
