const {execFile} = require('node:child_process');
import path from 'path';
import * as fs from 'fs';
import {ensureDirectory, getAppPath} from './file-service';
const G3PAK_PATH = path.resolve(__dirname, '../../../Tools/G3Pak.exe');
const G3PAKDIR_PATH = path.resolve(__dirname, '../../../Tools/G3PakDir.exe');
let PRESETS_PATH;

let MAIN_PATH;
//TODO: Ogarnąć ścieżki do aplikacji
//przpypisać ścieżki do stałych
getAppPath().then((mainPath: string) => {
  MAIN_PATH = mainPath;
  PRESETS_PATH = path.join(MAIN_PATH, 'Presets');
  console.log(PRESETS_PATH);
});

export async function buildPackage(srcPath: string, destPath?: string): Promise<string> {
  const destinationPath = destPath ?? srcPath + '\\kek.pak';
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
  await ensureDirectory(tempDir);
  await extractAll(file, tempDir);
  for (const fileName of fileNames) {
    const sourceFilePath = path.join(tempDir, fileName);
    const destinationFilePath = path.join(destinationPath, fileName);

    try {
      await fs.renameSync(sourceFilePath, destinationFilePath);
      console.log(`Przeniesiono ${fileName}`);
    } catch (error) {
      console.error(`Błąd podczas przenoszenia ${fileName}: ${error}`);
    }
  }
  fs.rm(tempDir, {recursive: true, force: true}, error => {
    return new Promise<void>((resolve, reject) => {
      if (error) {
        return reject();
      }
      return resolve();
    });
  });
}

export async function findStrings(dataPath: string): Promise<string> {
  const files: string[] = [];
  try {
    const filesList = fs.readdirSync(dataPath);
    const regex = /^strings/i; // "i" oznacza ignorowanie wielkości liter

    for (const file of filesList) {
      if (regex.test(file)) {
        files.push(path.join(dataPath, file));
      }
    }
  } catch (error) {
    console.error(`Błąd podczas wyszukiwania plików: ${error}`);
  }

  console.log(files);
  return files[0];
}
