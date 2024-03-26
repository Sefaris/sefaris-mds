import {exec} from 'child_process';
import {ipcRenderer} from 'electron';
import * as fs from 'fs';
import path from 'path';
import type {AppConfiguration} from '../interfaces/app-configuration';
import {loadConfiguration} from './configuration-service';
export async function ensureDirectory(directoryPath: string): Promise<void> {
  if (!fs.existsSync(directoryPath)) {
    fs.promises.mkdir(directoryPath, {recursive: true});
  }
}

export async function getAppPath(): Promise<string> {
  return await ipcRenderer.invoke('get-app-path');
}

export function findFilesEndsWith(directoryPath: string, fileExtension: string): string[] {
  const files: string[] = [];

  try {
    const filesList = fs.readdirSync(directoryPath);

    for (const file of filesList) {
      if (file.endsWith(`.${fileExtension}`)) {
        files.push(path.join(directoryPath, file));
      }
    }
  } catch (error) {
    alert(error);
  }

  return files;
}

export async function openGameFolder() {
  const configuration: AppConfiguration = (await loadConfiguration()) as AppConfiguration;
  exec(`explorer ${configuration.gothicPath}`);
}

export async function openModsFolder() {
  const configuration: AppConfiguration = (await loadConfiguration()) as AppConfiguration;
  exec(`explorer ${configuration.modsPath}`);
}
