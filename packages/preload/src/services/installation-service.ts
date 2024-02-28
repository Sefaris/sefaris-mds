/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fs from 'fs';
import * as os from 'os';

import path from 'path';
import {loadConfiguration, saveConfiguration} from './configuration-service';
import type {Mod} from '../interfaces/mod';
import type {AppConfiguration} from '../interfaces/app-configuration';

import {buildPackage, extract, extractAll, findStrings} from './pak-service';

import {ensureDirectory, findFilesEndsWith} from './file-service';
import {loadMods} from './mod-service';

const G3_DOCUMENTS_PATH = path.join(os.homedir(), 'Documents', 'gothic3');

const APP_PATH = path.resolve();
const STATIC_FILES_PATH = path.join(APP_PATH, 'Static');
const STATIC_FILE_MOD_EXTENSTION = '0x';
const STRINGTABLE_FILENAME = 'stringtable.ini';
const STRINGTABLEMOD_FILENAME = 'stringtablemod.ini';

const MOD_EXTENSTIONS = ['mod', 'nod'];
const DLL_EXTENSION = 'dll';
const SAVE_EXTENSION = 'g3savcpx';
const SAVEDAT_EXTENSION = 'g3savcpxdat';
const SPLASH = 'splash.bmp';
const SHADER = 'Shader.Cache';

const STRINGTABLE_ENCODING = 'utf16le';

export async function installMods(modIds: string[], preset?: string): Promise<string> {
  alert(APP_PATH);
  const configuration: AppConfiguration = (await loadConfiguration()) as AppConfiguration;
  const filesDictionary = prepareFilesDictionary();
  const scriptFiles:string[] = [];
  const createdFiles: string[] = [];
  const dataPath = path.join(configuration.gothicPath, 'Data');
  const scriptsPath = path.join(configuration.gothicPath, 'scripts');
  const allMods: Mod[] = await loadMods();
  const mods = allMods.filter(mod => modIds.includes(mod.id));

  const startTime = performance.now();
  await deleteMods();
  await moveSaves();

  await moveSplash(configuration, preset);
  await moveShader(preset);

  for (const mod of mods) {
    for (const extension of MOD_EXTENSTIONS) {
      const files = findFilesEndsWith(mod.path, `${extension[0]}${STATIC_FILE_MOD_EXTENSTION}`);
      if (!filesDictionary[extension]) {
        filesDictionary[extension] = [];
      }
      filesDictionary[extension].push(...files);
    }
    const scripts = findFilesEndsWith(mod.path, DLL_EXTENSION);
    scriptFiles.push(...scripts);
  }

  appendFakeFiles(filesDictionary);

  
  
  for (const key in filesDictionary) {
    {
      await copyFiles(dataPath, key, filesDictionary[key], createdFiles);
    }
  }
  await copyScripts(scriptsPath, scriptFiles, createdFiles);
  
  await buildStringTable(dataPath, mods, createdFiles);
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

async function copyScripts(destinationPath: string,
  filePaths: string[],
  createdFiles: string[],
  ): Promise<void>{
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const fileName = path.basename(filePath);
    const newFilePath = path.join(destinationPath, fileName);
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
    console.error(err);
  }
}

function appendFakeFiles(dictionary: Record<string, string[]>): void {
  dictionary['mod'].push(path.join(STATIC_FILES_PATH, 'Projects_compiled.m0x'));
  dictionary['nod'].push(path.join(STATIC_FILES_PATH, 'Projects_compiled.n0x'));
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

async function moveSaves() {
  const newModsFolder = getNextSaveDirectoryName();
  const newModsFolderPath = path.join(G3_DOCUMENTS_PATH, newModsFolder);
  const oldFilesPaths = getOldModsFiles();
  if (oldFilesPaths.length === 0) {
    return;
  }
  await ensureDirectory(newModsFolderPath);
  const newFilesPaths = getNewModsFilesPaths(oldFilesPaths, newModsFolder);
  for (let i = 0; i < oldFilesPaths.length; i++) {
    await fs.promises.rename(oldFilesPaths[i], newFilesPaths[i]);
  }
}

function getOldModsFiles() {
  const saves = findFilesEndsWith(G3_DOCUMENTS_PATH, SAVE_EXTENSION);
  const savesDat = findFilesEndsWith(G3_DOCUMENTS_PATH, SAVEDAT_EXTENSION);
  const shader = findFilesEndsWith(G3_DOCUMENTS_PATH, 'Cache');

  return saves.concat(savesDat).concat(shader);
}

function getNextSaveDirectoryName(): string {
  let maxNumber = -1;
  const directories = fs.readdirSync(G3_DOCUMENTS_PATH);

  for (const directory of directories) {
    const directoryName = path.basename(directory);

    if (directoryName.startsWith('Mods')) {
      const numberString = directoryName.substring(4);
      const number = parseInt(numberString, 10);

      if (!isNaN(number)) {
        maxNumber = Math.max(maxNumber, number);
      }
    }
  }

  const nextNumber = maxNumber + 1;
  return `Mods${nextNumber.toString()}`;
}

function getNewModsFilesPaths(files: string[], destDirectory: string) {
  const newFilesPaths: string[] = [];
  for (const file of files) {
    const fileName = path.basename(file);
    const newFilePath = path.join(G3_DOCUMENTS_PATH, destDirectory, fileName);
    newFilesPaths.push(newFilePath);
  }
  return newFilesPaths;
}

async function moveSplash(configuration: AppConfiguration, presetName?: string) {
  let splash = path.join(APP_PATH, 'Static', SPLASH);
  if (presetName && fs.existsSync(path.join(APP_PATH, 'Presets', presetName, SPLASH))) {
    splash = path.join(APP_PATH, 'Presets', presetName, SPLASH);
  }

  if (!fs.existsSync(splash)) {
    return;
  }

  const splashDest = path.join(configuration.gothicPath, SPLASH);
  await fs.copyFileSync(splash, splashDest);
}

async function moveShader(presetName?: string) {
  if (!presetName) {
    return;
  }
  const shader = path.join(APP_PATH, 'Presets', presetName, SHADER);
  if (!fs.existsSync(shader)) {
    return;
  }
  const shaderDest = path.join(G3_DOCUMENTS_PATH, SHADER);
  await fs.copyFileSync(shader, shaderDest);
}
