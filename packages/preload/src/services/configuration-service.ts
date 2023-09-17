import {contextBridge, ipcRenderer} from 'electron';
import type {AppConfiguration} from '../interfaces/app-configuration';
import * as fs from 'fs';
import * as path from 'path';

const configurationPath = 'config.json';

export function selectGameFolder(): void {
  ipcRenderer.send('open-folder-dialog');
}

export async function saveConfiguration(configuration: AppConfiguration): Promise<void> {
  fs.writeFileSync(configurationPath, JSON.stringify(configuration));
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

contextBridge.exposeInMainWorld('Apieriusz', {
  onFolderSelected: (callback: (folderPath: string) => void) => {
    ipcRenderer.on('folder-selected', (event, folderPath) => {
      callback(folderPath);
    });
  },
});
