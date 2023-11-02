import {ipcRenderer} from 'electron';
import * as fs from 'fs';
import path from 'path';
export async function ensureDirectory(directoryPath: string): Promise<void> {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
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
    console.error(`Error while finding files: ${error}`);
  }

  return files;
}
