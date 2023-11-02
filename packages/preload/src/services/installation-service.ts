/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fs from 'fs';
import * as os from 'os';

import path from 'path';
import {loadConfiguration, saveConfiguration} from './configuration-service';
import type {Mod} from '../interfaces/mod';
import type {AppConfiguration} from '../interfaces/app-configuration';
import {ipcRenderer} from 'electron';

import {buildPackage, extract, findStrings} from './pak-service';

import {ensureDirectory} from './file-service';
import {loadMods} from './mod-service';
import {updateProgressBar} from './progress-service';

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

const STRINGTABLE_ENCODING = 'utf16le';

const destPath = 'D:\\Repos\\Sefaris\\destMods';

export async function installMods(modIds: string[]): Promise<string> {
  const configuration: AppConfiguration = (await loadConfiguration()) as AppConfiguration;
  const filesDictionary = prepareFilesDictionary();
  const createdFiles: string[] = [];

  const allMods: Mod[] = await loadMods();
  const mods = allMods.filter(mod => modIds.includes(mod.id));
  console.log(mods);
  const startTime = performance.now();
  await deleteMods();
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

  for (const key in filesDictionary) {
    {
      await copyFiles(getDataPath(configuration), key, filesDictionary[key], createdFiles);
    }
  }

  await buildStringTable(getDataPath(configuration), mods, createdFiles);
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
  ensureDirectory(path.join(configuration.gothicPath, 'Data'));
  return path.join(configuration.gothicPath, 'Data');
}

async function buildStringTable(
  gothicDataPath: string,
  mods: Mod[],
  createdFiles: string[],
): Promise<void> {
  const stringTablePath = await findStrings(gothicDataPath);
  const destinationPath = gothicDataPath;
  const tempDir = path.join(gothicDataPath, 'temp');
  const fileName = path.basename(stringTablePath);

  const nameWithoutExtension = removeFileNameExtension(fileName).toLowerCase();

  const destinationFileName =
    (await getFreeFileName(destinationPath, nameWithoutExtension, 'mod')) ??
    (await getFreeFileName(destinationPath, nameWithoutExtension, 'pak'));

  const packageDestPath = path.join(destinationPath, destinationFileName);
  await mergeStringTables(gothicDataPath, mods, stringTablePath);
  await buildPackage(tempDir, packageDestPath);
  createdFiles.push(packageDestPath);

  fs.rmSync(tempDir, {recursive: true, force: true});
}

async function mergeStringTables(
  gothicDataPath: string,
  mods: Mod[],
  originalStringTable: string,
): Promise<void> {
  const tempDir = path.join(gothicDataPath, 'temp');
  await ensureDirectory(tempDir);
  await extract(originalStringTable, [STRINGTABLE_FILENAME], tempDir);
  const stringTable = path.join(tempDir, STRINGTABLE_FILENAME);
  const locAdminRevision = '[LocAdmin_Revisions]';

  const originalStringTableContent = fs
    .readFileSync(stringTable, {encoding: STRINGTABLE_ENCODING, flag: 'r'})
    .replace(locAdminRevision, '');
  fs.writeFileSync(stringTable, originalStringTableContent, {
    encoding: STRINGTABLE_ENCODING,
    flag: 'w',
  });

  mods.forEach(element => {
    const modStringTable = path.join(element.path, STRINGTABLEMOD_FILENAME);
    if (fs.existsSync(modStringTable)) {
      const modStringTableContent = fs
        .readFileSync(modStringTable, {
          encoding: STRINGTABLE_ENCODING,
          flag: 'r',
        })
        .replace('[LocAdmin_Strings]', '');
      fs.appendFileSync(stringTable, modStringTableContent, {
        encoding: STRINGTABLE_ENCODING,
        flag: 'a',
      });
    }
  });

  fs.appendFileSync(stringTable, `\n${locAdminRevision}`, {
    encoding: STRINGTABLE_ENCODING,
    flag: 'a',
  });
}
