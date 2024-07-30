import { ipcRenderer } from 'electron';
import type { AppConfiguration } from '@interfaces/app-configuration';
import * as fs from 'fs';
import * as path from 'path';

const configurationFile = 'config.json';

export async function selectGameFolder(): Promise<string> {
  return await ipcRenderer.invoke('open-folder-dialog');
}

export async function saveConfiguration(configuration: AppConfiguration): Promise<boolean> {
  try {
    if (import.meta.env.PROD) {
      configuration.modsPath = path.join(configuration.gothicPath, 'Mods');
    } else {
      configuration.modsPath = 'C:\\Users\\Komputeriusz\\Desktop\\MDS-Sefaris\\Mods\\mods';
    }
    if (!configuration.gothicPath) {
      return false;
    }

    fs.writeFileSync(configurationFile, JSON.stringify(configuration, null, 4));
  } catch (error) {
    alert(error);
    return false;
  }
  return true;
}

export async function loadConfiguration(): Promise<AppConfiguration | null> {
  if (!fs.existsSync(configurationFile)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(configurationFile, 'utf-8'));
}

export function isGothicPathValid(param: AppConfiguration | string): boolean {
  if (typeof param === 'string') {
    return fs.existsSync(path.join(param, 'Gothic3.exe'));
  } else {
    return fs.existsSync(path.join(param.gothicPath, 'Gothic3.exe'));
  }
}
