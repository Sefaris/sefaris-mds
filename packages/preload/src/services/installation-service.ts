/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fs from 'fs';
import * as os from 'os';

import path from 'path';
import {loadConfiguration, saveConfiguration} from './configuration-service';
import type {Mod} from '../interfaces/mod';
import type {AppConfiguration} from '../interfaces/app-configuration';
import {ipcRenderer} from 'electron';
import {computed} from 'vue';

let appPath: string;
let staticFilesPath: string;
ipcRenderer.invoke('get-app-path').then((applicationPath: string) => {
  appPath = applicationPath;
  staticFilesPath = path.join(appPath, 'Static');
});

const G3_DOCUMENTS_PATH = path.join(os.homedir(), 'Documents');

const STATIC_FILE_MOD_EXTENSTION = '0x';
const STRINGTABLE_FILENAME = 'stringtable.ini';
const STRINGTABLEMOD_FILENAME = 'stringtablemod.ini';

const MOD_EXTENSTIONS = ['mod', 'nod'];
const SAVE_EXTENSION = 'g3savcpx';
const SAVEDAT_EXTENSION = 'g3savcpxdat';
const SPLASH = 'splash.bmp';
const SHADER = 'Shader.Cache';

const destPath = 'D:\\Repos\\Sefaris\\destMods';

export async function installMods(mods: Mod[]): Promise<string> {
  const configuration: AppConfiguration = (await loadConfiguration()) as AppConfiguration;
  const files: string[] = [];
  const startTime = performance.now();
  await deleteMods();
  const filesDictionary = prepareFilesDictionary();
  for (const mod of mods) {
    for (const extension of MOD_EXTENSTIONS) {
      const files = findFilesEndsWith(mod.path, `${extension[0]}${STATIC_FILE_MOD_EXTENSTION}`);
      if (!filesDictionary[extension]) {
        filesDictionary[extension] = [];
      }
      filesDictionary[extension].push(...files);
    }
  }

  appendFakeFiles(filesDictionary);

  const createdFiles: string[] = [];
  for (const key in filesDictionary) {
    {
      await copyFiles(destPath, key, filesDictionary[key], createdFiles);
    }
  }

  const endTime = performance.now();
  const time = ((endTime - startTime) / 1000).toFixed(3);

  configuration.installedMods = mods.map(mod => mod.id);
  configuration.filesCreated = createdFiles;
  await saveConfiguration(configuration);

  return time.toString();
}

function prepareFilesDictionary(): Record<string, string[]> {
  const filesDictionary: Record<string, string[]> = {};

  for (const extension of MOD_EXTENSTIONS) {
    filesDictionary[extension] = [];
  }
  return filesDictionary;
}

function findFilesEndsWith(modDirectoryPath: string, fileExtension: string): string[] {
  const files: string[] = [];

  try {
    const filesList = fs.readdirSync(modDirectoryPath);

    for (const file of filesList) {
      if (file.endsWith(`.${fileExtension}`)) {
        files.push(path.join(modDirectoryPath, file));
      }
    }
  } catch (error) {
    console.error(`Error while finding files: ${error}`);
  }

  return files;
}

async function copyFiles(
  destinationPath: string,
  extension: string,
  filePaths: string[],
  createdFiles: string[],
): Promise<void> {
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const fileName = path.basename(filePath);
    const nameWithoutExtension = removeFileNameExtension(fileName).toLowerCase();
    const destinationFileName = await getFreeFileName(
      destinationPath,
      nameWithoutExtension,
      extension,
    );

    const newFilePath = path.join(destinationPath, destinationFileName);
    fs.copyFileSync(filePath, newFilePath);

    createdFiles.push(newFilePath);
  }
}

function removeFileNameExtension(fileName: string): string {
  return path.parse(fileName).name;
}

async function getFreeFileName(
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

export async function deleteMods(): Promise<void> {
  const configuration: AppConfiguration = (await loadConfiguration()) as AppConfiguration;

  try {
    configuration.filesCreated.forEach((file: string) => {
      fs.unlinkSync(file);
    });

    configuration.installedMods = [];
    configuration.filesCreated = [];

    await saveConfiguration(configuration);
  } catch (err) {
    console.log(err);
  }
}

function appendFakeFiles(dictionary: Record<string, string[]>): void {
  dictionary['mod'].push(path.join(staticFilesPath, 'Projects_compiled.m0x'));
  dictionary['nod'].push(path.join(staticFilesPath, 'Projects_compiled.n0x'));
}

function getDataPath(configuration: AppConfiguration): string {
  if (!configuration) {
    return '';
  }
  return path.join(configuration.gothicPath, 'Data');
}
