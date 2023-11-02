import {ipcRenderer} from 'electron';
import * as fs from 'fs';
export async function ensureDirectory(directoryPath: string): Promise<void> {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
}

export async function getAppPath(): Promise<string> {
  return await ipcRenderer.invoke('get-app-path');
}
