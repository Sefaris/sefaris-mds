const { execFile } = require('node:child_process');
import path from 'path';
import * as fs from 'fs';
import { ensureDirectory } from './file-service';
import { loggerError } from './logger-service';
import { ipcRenderer } from 'electron';

let G3PAK_PATH = path.resolve(__dirname, '../../../Tools/G3Pak/G3Pak.exe');
let G3PAKDIR_PATH = `"${path.resolve(__dirname, '../../../Tools/G3Pak/G3PakDir.exe')}"`;

// check is asar is used to pack app
async function getIsPackaged() {
  return await ipcRenderer.invoke('get-is-packaged');
}

export async function buildPackage(srcPath: string, destPath?: string): Promise<string> {
  // change paths for packed application
  if (await getIsPackaged()) {
    G3PAK_PATH = path.join(process.resourcesPath, 'app', 'Tools', 'G3Pak', 'G3Pak.exe');
    G3PAKDIR_PATH = `"${path.join(process.resourcesPath, 'app', 'Tools', 'G3Pak', 'G3PakDir.exe')}"`;
  }
  const destinationPath = destPath ?? srcPath + '\\output.pak';
  return new Promise((resolve, reject) => {
    execFile(
      G3PAKDIR_PATH,
      ['--no-comments', '--no-deletion', `"${srcPath}"`, `"${destinationPath}"`],
      {
        shell: true,
        windowsHide: false,
        maxBuffer: 1024 * 1024 * 1024,
      },

      (error: string, stdout: string, stderr: string) => {
        if (error) {
          return reject(error);
        }

        if (stderr) {
          return reject(stderr);
        }

        return resolve(stdout);
      },
    );
  });
}

export async function extractAll(file: string, destinationPath: string): Promise<string> {
  // change paths for packed application

  if (await getIsPackaged()) {
    G3PAK_PATH = path.join(process.resourcesPath, 'app', 'Tools', 'G3Pak', 'G3Pak.exe');
    G3PAKDIR_PATH = `"${path.join(process.resourcesPath, 'app', 'Tools', 'G3Pak', 'G3PakDir.exe')}"`;
  }
  return new Promise((resolve, reject) => {
    execFile(
      G3PAK_PATH,
      ['--extract-all', file, destinationPath],
      {
        shell: false,
        windowsHide: true,
      },

      (error: string, stdout: string, stderr: string) => {
        if (error) {
          return reject(error);
        }

        if (stderr) {
          return reject(stderr);
        }

        return resolve(stdout);
      },
    );
  });
}

export async function extract(
  file: string,
  fileNames: string[],
  destinationPath: string,
): Promise<void> {
  const tempDir = path.join(destinationPath, 'temp');
  ensureDirectory(tempDir);
  await extractAll(file, tempDir);
  try {
    for (const fileName of fileNames) {
      const sourceFilePath = path.join(tempDir, fileName);
      const destinationFilePath = path.join(destinationPath, fileName);

      fs.renameSync(sourceFilePath, destinationFilePath);
    }
    fs.rm(tempDir, { recursive: true, force: true }, error => {
      return new Promise<void>((resolve, reject) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    });
  } catch (error) {
    alert(error);
    loggerError(error as string);
  }
}

export async function findStrings(dataPath: string): Promise<string> {
  const files: string[] = [];

  const filesList = fs.readdirSync(dataPath);
  const regex = /^strings/i;

  for (const file of filesList) {
    if (regex.test(file)) {
      files.push(path.join(dataPath, file));
    }
  }

  return files[0];
}
