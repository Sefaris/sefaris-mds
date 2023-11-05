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

export function loadModDescription(modPath: string): string {
  const md = new MarkdownIt();
  const file = path.join(modPath, 'readme.md');
  if (!fs.existsSync(file)) {
    return 'No description available.';
  }
  return md.render(fs.readFileSync(file, 'utf8'));
}

export function loadImages(modPath: string): string[] {
  const files = fs.readdirSync(modPath);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
  });
  const images: string[] = [];
  if (imageFiles.length > 0) {
    for (const imageFile of imageFiles) {
      const img = path.join(modPath, imageFile);
      images.push(`data:image/png;base64,${fs.readFileSync(img).toString('base64')}`);
    }
  }
  return images;
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
