import {ipcRenderer} from 'electron';
import * as fs from 'fs';
export async function ensureDirectory(directoryPath: string): Promise<void> {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
}

export function getAppPath(): Promise<string> {
  return ipcRenderer.invoke('get-app-path').then(result => {
    return new Promise<string>((resolve, reject) => {
      if (result) {
        return resolve(result);
      } else {
        return reject();
      }
    });
  });
}
