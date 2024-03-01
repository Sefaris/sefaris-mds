import {ipcRenderer} from 'electron';
import type {AppConfiguration} from '../interfaces/app-configuration';
import * as fs from 'fs';
import * as path from 'path';

const configurationPath = 'config.json';

export async function selectGameFolder(): Promise<string> {
  return await ipcRenderer.invoke('open-folder-dialog');
}

export async function saveConfiguration(configuration: AppConfiguration): Promise<boolean> {
  try {
    if (import.meta.env.PROD) {
      configuration.modsPath = path.join(configuration.gothicPath, 'Mods');
    } else {
      configuration.modsPath = 'E:\\SteamLibrary\\steamapps\\common\\Gothic 3\\Mods';
    }
    if (!configuration.gothicPath) {
      return false;
    }

    fs.writeFileSync(configurationPath, JSON.stringify(configuration));
  } catch (error) {
    alert(error);
    return false;
  }
  return true;
}

export async function loadConfiguration(): Promise<AppConfiguration | null> {
  if (!fs.existsSync(configurationPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(configurationPath, 'utf-8'));
}

export function isGothicPathValid(param: AppConfiguration | string): boolean {
  if (typeof param === 'string') {
    console.log('Sprawdzam ścieżkę:', param);
    return fs.existsSync(path.join(param, 'Gothic3.exe'));
  } else {
    console.log('Sprawdzam ścieżkę:', path.join(param.gothicPath, 'Gothic3.exe'));
    return fs.existsSync(path.join(param.gothicPath, 'Gothic3.exe'));
  }
}
