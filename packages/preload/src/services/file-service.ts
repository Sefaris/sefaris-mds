import { exec, spawn } from 'child_process';
import { ipcRenderer } from 'electron';
import * as fs from 'fs';
import path from 'path';
import { loadConfiguration } from './configuration-service';
import { updateProgressBar } from './progress-service';
import { loggerError, loggerInfo } from './logger-service';
import { getMessage } from '../../../../utils/messages';
import Winreg from 'winreg';
import { InstallationError } from '../../../../Errors/InstallationError';
import { NotFoundError } from '../../../../Errors/NotFoundError';

export function ensureDirectory(directoryPath: string) {
  if (!fs.existsSync(directoryPath)) {
    loggerInfo(getMessage('DIRECTORY_CREATE', { path: directoryPath }));
    fs.mkdirSync(directoryPath, { recursive: true });
    loggerInfo(getMessage('DIRECTORY_CREATED'));
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
      if (path.extname(file) === `.${fileExtension}`) {
        files.push(path.join(directoryPath, file));
      }
    }
  } catch (error) {
    loggerError(error as string);
  }

  return files;
}

export async function startGame() {
  try {
    const configuration = await loadConfiguration();
    if (!configuration) return;
    const execPath = path.join(configuration.gothicPath, 'Gothic3.exe');
    if (!fs.existsSync(execPath)) throw new NotFoundError(getMessage('GOTHIC_EXE_NOT_FOUND'));

    spawn(execPath, { cwd: configuration.gothicPath, detached: true });
  } catch (error) {
    loggerError(error as string);
  }
}

export async function openGameFolder() {
  const configuration = await loadConfiguration();
  if (!configuration) return;
  openFolder(configuration.gothicPath);
}

export async function openModsFolder() {
  const configuration = await loadConfiguration();
  if (!configuration) return;
  openFolder(configuration.modsPath);
}

export function openFolder(path?: string) {
  if (!path) return;
  if (!fs.existsSync(path)) return;
  exec(`explorer ${path}`);
}

export function swapFileNames(filePath1: string, filePath2: string) {
  const tempFilePath = path.join(path.dirname(filePath1), 'temp_swap_file');

  if (!fs.existsSync(filePath1)) {
    throw new InstallationError(`${getMessage('FILE_DOESNT_EXIST', { path: filePath1 })}`);
  }
  if (!fs.existsSync(filePath2)) {
    throw new InstallationError(`${getMessage('FILE_DOESNT_EXIST', { path: filePath2 })}`);
  }

  fs.renameSync(filePath1, tempFilePath);
  fs.renameSync(filePath2, filePath1);
  fs.renameSync(tempFilePath, filePath2);
}

export function removeFileNameExtension(fileName: string): string {
  return path.parse(fileName).name;
}

export async function getFreeFileName(
  destinationPath: string,
  baseName: string,
  extension: string,
): Promise<string> {
  let fileName = `${baseName}.${extension}`;
  let count = 0;

  while (fs.existsSync(path.join(destinationPath, fileName))) {
    fileName = `${baseName}.${extension[0]}${count.toString().padStart(2, '0')}`;
    count++;
  }

  return fileName;
}

export async function getLastExistingFileName(
  destinationPath: string,
  baseName: string,
  extension: string,
): Promise<string> {
  let fileName = `${baseName}.${extension}`;
  let lastExistingFileName = '';
  let count = 0;

  while (fs.existsSync(path.join(destinationPath, fileName))) {
    lastExistingFileName = fileName;
    fileName = `${baseName}.${extension[0]}${count.toString().padStart(2, '0')}`;
    count++;
  }

  return lastExistingFileName || `${baseName}.${extension}`;
}

export async function copyFiles(
  destinationPath: string,
  extension: string,
  filePaths: string[],
  createdFiles: string[],
): Promise<void> {
  for (let i = 0; i < filePaths.length; i++) {
    updateProgressBar('progress.copyMods', i, filePaths.length);
    const filePath = filePaths[i];
    const fileName = path.basename(filePath);
    const nameWithoutExtension = removeFileNameExtension(fileName).toLowerCase();
    const destinationFileName = await getFreeFileName(
      destinationPath,
      nameWithoutExtension,
      extension,
    );
    const newFilePath = path.join(destinationPath, destinationFileName);
    loggerInfo(getMessage('COPY_FILE_FROM_TO', { src: filePath, dst: newFilePath }));
    await fs.promises.copyFile(filePath, newFilePath);
    loggerInfo(getMessage('COPY_FILE_FROM_TO_COMPLETE', { src: filePath, dst: newFilePath }));
    createdFiles.push(newFilePath);
  }
}
export async function getDocumentsPath(): Promise<string> {
  return new Promise((resolve, reject) => {
    const regKey = new Winreg({
      hive: Winreg.HKCU,
      key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders',
    });

    regKey.get('Personal', (err, item) => {
      if (err) {
        reject(err);
      } else {
        resolve(item.value);
      }
    });
  });
}
