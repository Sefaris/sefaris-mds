import type { Mod } from '@interfaces/Mod';
import { loadConfiguration } from './configuration-service';
import * as fs from 'fs';
import * as path from 'path';
import MarkdownIt from 'markdown-it';
import { DEFAULT_LANGUAGE } from '../../../../utils/constants';

const UTF8 = 'utf8';

export async function loadMods(): Promise<Mod[]> {
  const configuration = await loadConfiguration();
  const mods: Mod[] = [];

  if (!configuration?.modsPath) {
    return [];
  }

  fs.readdirSync(configuration.modsPath).forEach(file => {
    const filePath = path.join(configuration.modsPath!, file);
    const mod = validateMod(filePath);
    if (mod) {
      mods.push(mod);
    }
  });
  return mods;
}

export function validateMod(modPath: string): Mod | null {
  if (!fs.existsSync(path.join(modPath, 'mod.json'))) {
    console.error('mod.json not found in ' + modPath);
    return null;
  }

  const mod: Mod = JSON.parse(fs.readFileSync(path.join(modPath, 'mod.json'), UTF8));

  if (
    !(
      typeof mod.id === 'string' &&
      typeof mod.title === 'string' &&
      Array.isArray(mod.authors) &&
      Array.isArray(mod.dependencies) &&
      Array.isArray(mod.incompatibles)
    )
  ) {
    console.error(`Wrong json structure for ${path.basename(modPath)}`);
    return null;
  }

  if (!mod.id || !mod.title) {
    return null;
  }

  mod.path = modPath;
  mod.directoryName = path.basename(modPath);
  return mod;
}

export async function loadModDescription(modPath: string): Promise<string | null> {
  const md = new MarkdownIt();
  const config = await loadConfiguration();
  const locale = config?.language || DEFAULT_LANGUAGE;

  const file = path.join(modPath, `readme_${locale}.md`);
  if (!fs.existsSync(file)) {
    return null;
  }
  return md.render(fs.readFileSync(file, UTF8));
}

export function loadImages(modPath: string): string[] {
  const imagesPath = path.join(modPath, 'Pictures');
  if (!fs.existsSync(imagesPath)) return [];
  const files = fs.readdirSync(imagesPath);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
  });
  const images: string[] = [];
  if (imageFiles.length > 0) {
    for (const imageFile of imageFiles) {
      const img = path.join(imagesPath, imageFile);
      images.push(`data:image/png;base64,${fs.readFileSync(img).toString('base64')}`);
    }
  }
  return images;
}
