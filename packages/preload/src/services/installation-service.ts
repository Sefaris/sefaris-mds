import * as fs from 'fs';
import * as os from 'os';

import path from 'path';
import { loadConfiguration, saveConfiguration } from './configuration-service';
import type { Mod } from '@interfaces/mod';
import type { AppConfiguration } from '@interfaces/app-configuration';

import { buildPackage, extract, findStrings } from './pak-service';

import {
  copyFiles,
  ensureDirectory,
  findFilesEndsWith,
  getFreeFileName,
  getLastExistingFileName,
  removeFileNameExtension,
  swapFileNames,
} from './file-service';
import { loadMods } from './mod-service';
import { updateProgressBar } from './progress-service';

const G3_DOCUMENTS_PATH = path.join(os.homedir(), 'Documents', 'gothic3');

const APP_PATH = path.resolve();
const STATIC_FILES_PATH = path.join(APP_PATH, 'Static');
const PRESET_FILES_PATH = path.join(APP_PATH, 'Presets');
const STATIC_FILE_MOD_EXTENSTION = '0x';
const STRINGTABLE_FILENAME = 'stringtable.ini';
// const STRINGTABLEMOD_FILENAME = 'stringtablemod.ini';

const MOD_EXTENSTIONS = ['mod', 'nod'];
const DLL_EXTENSION = 'dll';
const INI_EXTENSION = 'ini';
const SAVE_EXTENSION = 'g3savcpx';
const SAVEDAT_EXTENSION = 'g3savcpxdat';
const SPLASH = 'splash.bmp';
const SHADER = 'Shader.Cache';
const WRLDATASC = 'G3_World_01.wrldatasc';

const STRINGTABLE_ENCODING = 'utf16le';
const WRLDATASC_ENCODING = 'utf-8';

export async function installMods(modIds: string[], preset?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    (async () => {
      const configuration: AppConfiguration = (await loadConfiguration()) as AppConfiguration;
      const filesDictionary = prepareFilesDictionary();
      const scriptFiles: string[] = [];
      const iniFiles: string[] = [];
      const createdFiles: string[] = [];
      const dataPath = path.join(configuration.gothicPath, 'Data');
      const scriptsPath = path.join(configuration.gothicPath, 'scripts');
      const iniPath = path.join(configuration.gothicPath, 'ini');
      const allMods: Mod[] = await loadMods();
      const mods = allMods.filter(mod => modIds.includes(mod.id));

      try {
        const startTime = performance.now();
        await deleteMods();
        await moveSaves();

        await moveSplash(configuration, preset);
        await moveShader(preset);

        for (let i = 0; i < mods.length; i++) {
          updateProgressBar('progress.searchMods', i, mods.length);
          for (const extension of MOD_EXTENSTIONS) {
            const files = findFilesEndsWith(mods[i].path, `${extension[0]}${STATIC_FILE_MOD_EXTENSTION}`);
            if (!filesDictionary[extension]) {
              filesDictionary[extension] = [];
            }
            filesDictionary[extension].push(...files);
          }
          const scripts = findFilesEndsWith(mods[i].path, DLL_EXTENSION);
          scriptFiles.push(...scripts);
          const inis = findFilesEndsWith(mods[i].path, INI_EXTENSION);
          iniFiles.push(...inis);
        }

        appendFakeFiles(filesDictionary);

        for (const key in filesDictionary) {
          {
            await copyFiles(dataPath, key, filesDictionary[key], createdFiles);
          }
        }
        await copyScriptsFiles(scriptsPath, scriptFiles, createdFiles);
        await copyScriptsFiles(iniPath, iniFiles, createdFiles);

        await buildStringTable(dataPath, mods, createdFiles);
        await buildWrldatasc(dataPath, mods, createdFiles);
        const endTime = performance.now();
        const time = (endTime - startTime) / 1000;

        configuration.installedMods = mods.map(mod => mod.id);
        configuration.filesCreated = createdFiles;

        await saveConfiguration(configuration);

        resolve(time.toFixed(3));
      } catch (error) {
        // Remove copied files
        for (let i = 0; i < createdFiles.length; i++) {
          updateProgressBar('progress.delete', i, createdFiles.length);
          fs.unlinkSync(createdFiles[i]);
        }
        reject(error);
      }
    })();
  });
}

function prepareFilesDictionary(): Record<string, string[]> {
  const filesDictionary: Record<string, string[]> = {};

  for (const extension of MOD_EXTENSTIONS) {
    filesDictionary[extension] = [];
  }
  return filesDictionary;
}

async function copyScriptsFiles(destinationPath: string, filePaths: string[], createdFiles: string[]): Promise<void> {
  if (createdFiles.includes(path.basename(destinationPath))) {
    return;
  }

  for (let i = 0; i < filePaths.length; i++) {
    updateProgressBar('progress.copyScripts', i, filePaths.length);
    const filePath = filePaths[i];
    const fileName = path.basename(filePath);
    if (fileName.includes('stringtable')) {
      continue;
    }
    const newFilePath = path.join(destinationPath, fileName);
    await fs.promises.copyFile(filePath, newFilePath);
    createdFiles.push(newFilePath);
  }
}

export async function deleteMods(): Promise<void> {
  const configuration: AppConfiguration = (await loadConfiguration()) as AppConfiguration;

  const filesCount = configuration.filesCreated.length;
  for (let i = 0; i < filesCount; i++) {
    updateProgressBar('progress.delete', i, filesCount);
    fs.unlinkSync(configuration.filesCreated[i]);
  }

  configuration.installedMods = [];
  configuration.filesCreated = [];

  await saveConfiguration(configuration);
}

function appendFakeFiles(dictionary: Record<string, string[]>): void {
  dictionary['mod'].push(path.join(STATIC_FILES_PATH, 'Projects_compiled.m0x'));
  dictionary['nod'].push(path.join(STATIC_FILES_PATH, 'Projects_compiled.n0x'));
}

async function buildStringTable(gothicDataPath: string, mods: Mod[], createdFiles: string[]): Promise<void> {
  const stringTablePath = await findStrings(gothicDataPath);
  const tempDir = path.join(gothicDataPath, 'temp');
  const fileName = path.basename(stringTablePath);
  const nameWithoutExtension = removeFileNameExtension(fileName).toLowerCase();

  const destinationFileName =
    (await getFreeFileName(gothicDataPath, nameWithoutExtension, 'mod')) ??
    (await getFreeFileName(gothicDataPath, nameWithoutExtension, 'pak'));

  const packageDestPath = path.join(gothicDataPath, destinationFileName);
  await mergeStringTables(gothicDataPath, mods, stringTablePath);
  await buildPackage(tempDir, packageDestPath);
  createdFiles.push(packageDestPath);

  fs.rmSync(tempDir, { recursive: true, force: true });
}

async function mergeStringTables(gothicDataPath: string, mods: Mod[], originalStringTable: string): Promise<void> {
  const tempDir = path.join(gothicDataPath, 'temp');
  await ensureDirectory(tempDir);
  await extract(originalStringTable, [STRINGTABLE_FILENAME], tempDir);
  const stringTable = path.join(tempDir, STRINGTABLE_FILENAME);
  const locAdminRevision = '[LocAdmin_Revisions]';

  const originalStringTableContent = fs
    .readFileSync(stringTable, { encoding: STRINGTABLE_ENCODING, flag: 'r' })
    .replace(locAdminRevision, '');
  fs.writeFileSync(stringTable, originalStringTableContent, {
    encoding: STRINGTABLE_ENCODING,
    flag: 'w',
  });

  mods.forEach(element => {
    const modStringTable = path.join(element.path, STRINGTABLE_FILENAME);
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

async function buildWrldatasc(gothicDataPath: string, mods: Mod[], createdFiles: string[]) {
  const wrldataPath = path.join(STATIC_FILES_PATH, WRLDATASC);
  if (!fs.existsSync(wrldataPath)) throw new Error('No wrldatasc file');
  const outputFileName = await getFreeFileName(gothicDataPath, 'projects_compiled', 'mod');
  const outputFilePath = path.join(gothicDataPath, outputFileName);
  const lastExistingFileName = await getLastExistingFileName(gothicDataPath, 'projects_compiled', 'mod');
  const lastExistingFileNamePath = path.join(gothicDataPath, lastExistingFileName);
  if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);
  const tempDir = path.join(gothicDataPath, 'temp');
  await ensureDirectory(tempDir);
  await ensureDirectory(path.join(tempDir, 'G3_World_01'));
  const tempWrldataPath = path.join(tempDir, 'G3_World_01', WRLDATASC);
  fs.copyFileSync(wrldataPath, tempWrldataPath);
  mods.forEach(mod => {
    const wrldataMod = path.join(mod.path, WRLDATASC);
    if (fs.existsSync(wrldataMod)) {
      const wrldataModContent = fs.readFileSync(wrldataMod, { encoding: WRLDATASC_ENCODING, flag: 'r' });
      const sectors = wrldataModContent.replace(/^[\s\S]*?\[Sector\.List\]/, '');
      fs.appendFileSync(tempWrldataPath, sectors, {
        encoding: WRLDATASC_ENCODING,
        flag: 'a',
      });
    }
  });

  await buildPackage(tempDir, outputFilePath);
  fs.rmSync(tempDir, { recursive: true, force: true });
  if (path.extname(outputFilePath) == 'mod') return;
  swapFileNames(outputFilePath, lastExistingFileNamePath);
  createdFiles.push(outputFilePath);
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
    updateProgressBar('progress.moveOldSaves', i, oldFilesPaths.length);
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
  let splash = path.join(STATIC_FILES_PATH, SPLASH);
  if (presetName && fs.existsSync(path.join(PRESET_FILES_PATH, presetName, SPLASH))) {
    splash = path.join(PRESET_FILES_PATH, presetName, SPLASH);
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
  const shader = path.join(PRESET_FILES_PATH, presetName, SHADER);
  if (!fs.existsSync(shader)) {
    return;
  }
  const shaderDest = path.join(G3_DOCUMENTS_PATH, SHADER);
  await fs.copyFileSync(shader, shaderDest);
}
