import {ensureDirectory} from './file-service';
import path from 'path';
import * as fs from 'fs';
import type {Preset} from '../interfaces/preset';

const PRESET_JSON = 'preset.json';

export async function savePreset(modIds: string[], name: string) {
  console.log(modIds, name);
  const presetsDirPath = path.resolve('Presets');
  const presetPath = path.join(presetsDirPath, name);
  await ensureDirectory(presetsDirPath);
  await ensureDirectory(presetPath);

  const preset: Preset = {
    name,
    modIds,
  };

  const presetJsonPath = path.join(presetPath, PRESET_JSON);

  await fs.promises.writeFile(presetJsonPath, JSON.stringify(preset, null, 4));
}

export async function loadPreset(name: string): Promise<Preset> {
  if (!presetExists(name)) {
    //TODO: Wrzucić tłumaczenie na fronta
    alert(`error.presetNotFound ${name}`);
  }

  const presetJsonPath = path.resolve('Presets', name, PRESET_JSON);
  const presetJson = await fs.promises.readFile(presetJsonPath, 'utf-8');
  const preset: Preset = JSON.parse(presetJson);
  return preset;
}

export async function getPresetNames(): Promise<string[]> {
  const presetPath = path.resolve('Presets');
  await ensureDirectory(presetPath);
  const presetDirs = await fs.promises.readdir(presetPath);
  const presets = presetDirs.filter(presetExists);
  return presets;
}

export async function deletePreset(name: string) {
  if (!presetExists(name)) {
    //TODO: Wrzucić tłumaczenie na fronta
    alert(`error.presetNotFound ${name}`);
  }

  const presetPath = path.resolve('Presets', name);
  await fs.promises.rmdir(presetPath, {recursive: true});
}

function presetExists(name: string) {
  const presetPath = path.resolve('Presets', name, PRESET_JSON);
  return fs.existsSync(presetPath);
}
