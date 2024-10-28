import * as fs from 'fs';
import path from 'path';
import { buildPackage, extractAll } from './pak-service';
import { loadConfiguration, saveConfiguration } from './configuration-service';
import { ensureDirectory } from './file-service';
import type { AppConfiguration } from '../../../../interfaces/AppConfiguration';
import { updateProgressBar } from './progress-service';
import { loggerError } from './logger-service';

export async function mergeModFiles() {
  console.time('mergeModFiles');
  const configuration: AppConfiguration = (await loadConfiguration()) as AppConfiguration;
  const files = await configuration.filesCreated;
  const dataPath = path.join(configuration.gothicPath, 'Data');
  const mergedFiles: string[] = [];
  const map = groupFilesMap(files);
  const mFiles = Array.from(map.get('.m')?.values() ?? []);
  const nFiles = Array.from(map.get('.n')?.values() ?? []);

  await mergeArchives(mFiles, mergedFiles, dataPath);
  await mergeArchives(nFiles, mergedFiles, dataPath);

  configuration.filesCreated = mergedFiles;
  await saveConfiguration(configuration);
  console.timeEnd('mergeModFiles');
}

function sortModsArchives(paths: string[]): string[] {
  return paths.sort((a, b) => {
    const extA = path.extname(a);
    const extB = path.extname(b);

    if (extA === '.mod' && extB !== '.mod') {
      return -1;
    } else if (extA !== '.mod' && extB === '.mod') {
      return 1;
    } else if (extA === '.nod' && extB !== '.nod') {
      return -1;
    } else if (extA !== '.nod' && extB === '.nod') {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  });
}

function groupFilesMap(files: string[]): Map<string, Map<string, string[]>> {
  const groupedFiles = new Map<string, Map<string, string[]>>();
  const mFiles = new Map<string, string[]>();
  const nFiles = new Map<string, string[]>();

  for (const filePath of files) {
    const basename = path.parse(filePath).name;
    const extension = path.extname(filePath);

    if (extension.startsWith('.m')) {
      if (!mFiles.has(basename)) {
        mFiles.set(basename, []);
      }
      mFiles.get(basename)?.push(filePath);
    } else if (extension.startsWith('.n')) {
      if (!nFiles.has(basename)) {
        nFiles.set(basename, []);
      }
      nFiles.get(basename)?.push(filePath);
    }
  }

  groupedFiles.set('.m', mFiles);
  groupedFiles.set('.n', nFiles);

  return groupedFiles;
}

async function mergeArchives(archives: string[][], mergedFiles: string[], dataPath: string) {
  try {
    const backupDirPath = path.join(dataPath, 'backup');
    const mergeDirPath = path.join(dataPath, 'merge');
    for (let i = 0; i < archives.length; i++) {
      updateProgressBar('progress.mergeArchives', i, archives.length);
      const files = archives[i];
      if (files.length == 1) {
        mergedFiles.push(files[0]);
        continue;
      }
      ensureDirectory(backupDirPath);
      ensureDirectory(mergeDirPath);
      for (const file of files) {
        await fs.promises.rename(file, path.join(backupDirPath, path.basename(file)));
      }

      const mergeDirFiles = sortModsArchives(await fs.promises.readdir(backupDirPath));
      for (const file of mergeDirFiles) {
        const fullFilePath = path.join(backupDirPath, file);
        await extractAll(fullFilePath, mergeDirPath);
      }
      const resultFile = path.join(dataPath, path.basename(files[0]));
      await buildPackage(mergeDirPath, resultFile);
      mergedFiles.push(resultFile);
      await fs.promises.rmdir(backupDirPath, { recursive: true });
      await fs.promises.rmdir(mergeDirPath, { recursive: true });
    }
  } catch (error) {
    loggerError(error as string);
  }
}
