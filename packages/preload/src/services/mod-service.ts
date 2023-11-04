import type {Mod} from '../interfaces/mod';
import {loadConfiguration} from './configuration-service';
import * as fs from 'fs';
import * as path from 'path';
import MarkdownIt from 'markdown-it';
import type {AppConfiguration} from '../interfaces/app-configuration';

export async function loadMods(): Promise<Mod[]> {
  const configuration = await loadConfiguration();
  const mods: Mod[] = [];

  if (!configuration) {
    return [];
  }

  fs.readdirSync(configuration.modsPath).forEach(file => {
    const filePath = path.join(configuration.modsPath, file);
    const mod = validateMod(filePath);
    if (mod) {
      mods.push(mod);
    }
  });
  return mods;
}

function validateMod(modPath: string): Mod | null {
  if (!fs.existsSync(path.join(modPath, 'mod.json'))) {
    console.log('mod.json not found in ' + modPath);
    return null;
  }

  const mod: Mod = JSON.parse(fs.readFileSync(path.join(modPath, 'mod.json'), 'utf8'));
  if (!mod.id || !mod.title) {
    return null;
  }

  mod.path = modPath;
  mod.directoryName = path.basename(modPath);
  return mod;
}

export function loadModDescription(mod: Mod): string {
  const md = new MarkdownIt();
  const file = path.join(mod.path, 'readme.md');
  if (!fs.existsSync(file)) {
    return 'No description available.';
  }
  return md.render(fs.readFileSync(file, 'utf8'));
}

export function loadImage(mod: Mod): string | null {
  const files = fs.readdirSync(mod.path);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
  });
  if (imageFiles.length > 0) {
    return path.join(mod.path, imageFiles[0]);
  }
  return null;
}

export async function isModInstalled(id: string): Promise<boolean> {
  const configuration: AppConfiguration | null = await loadConfiguration();
  if (configuration) {
    return configuration.installedMods.includes(id);
  }
  return false;
}

export async function loadInstalledModsIds(): Promise<string[]> {
  const mods = await loadMods();
  const configuration = await loadConfiguration();
  if (!configuration) {
    return [];
  }

  const installedModsIds: string[] = [];
  for (const mod of mods) {
    if (!configuration.installedMods.includes(mod.id)) {
      continue;
    }

    installedModsIds.push(mod.id);
  }

  return installedModsIds;
}
