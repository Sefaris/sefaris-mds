const {execFile} = require('node:child_process');
import path from 'path';
import * as fs from 'fs';
import {ensureDirectory} from './file-service';
const G3ARCHIVE = path.resolve(__dirname, '../../../Tools/G3Archive/G3Archive.exe');

export async function buildPackage(srcPath: string, destPath?: string): Promise<string> {
  const destinationPath = destPath ?? srcPath + '\\kek.pak';
  return new Promise((resolve, reject) => {
    execFile(
      G3ARCHIVE,
      ['--pack', `"${srcPath}"`, '--dest', `"${destinationPath}"`, '--quiet'],
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
      G3ARCHIVE,
      ['--extract', file, '--dest', destinationPath, '--quiet', '--overwrite'],
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
    } catch (error) {
      alert(error);
    }
  }
  try {
    fs.rm(tempDir, {recursive: true, force: true}, error => {
      return new Promise<void>((resolve, reject) => {
        if (error) {
          return reject();
        }
        return resolve();
      });
    });
  } catch (error) {
    alert(error);
  }
}

export async function findStrings(dataPath: string): Promise<string> {
  const files: string[] = [];

  const filesList = fs.readdirSync(dataPath);
  const regex = /^strings/i; // "i" oznacza ignorowanie wielkości liter

  for (const file of filesList) {
    if (regex.test(file)) {
      files.push(path.join(dataPath, file));
    }
  }

  return files[0];
}
