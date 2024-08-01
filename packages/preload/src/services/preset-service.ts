import { ensureDirectory } from './file-service';
import path from 'path';
import * as fs from 'fs';
import type { Preset } from '@interfaces/preset';

const PRESET_JSON = 'preset.json';

export async function getPreset(name: string): Promise<Preset | null> {
  if (!presetExists(name)) {
    alert(`error.presetNotFound ${name}`);
    return null;
  }

  const presetJsonPath = path.resolve('Presets', name, PRESET_JSON);
  const presetJson = fs.readFileSync(presetJsonPath, 'utf-8');
  const preset: Preset = JSON.parse(presetJson);
  return preset;
}

export async function getAllPresets(): Promise<Preset[]> {
  const presets: Preset[] = [];
  const presetsPath = path.resolve('Presets');
  ensureDirectory(presetsPath);
  const presetDirs = fs.readdirSync(presetsPath);
  presetDirs.forEach(dir => {
    const presetJsonPath = path.resolve('Presets', dir, PRESET_JSON);
    if (fs.existsSync(presetJsonPath)) {
      const preset = JSON.parse(fs.readFileSync(presetJsonPath, 'utf-8'));
      presets.push(preset);
    }
  });
  return presets;
}

export async function getPresetNames(): Promise<string[]> {
  const presetPath = path.resolve('Presets');
  await ensureDirectory(presetPath);
  const presetDirs = await fs.promises.readdir(presetPath);
  const presets = presetDirs.filter(presetExists);
  return presets;
}

function presetExists(name: string) {
  const presetPath = path.resolve('Presets', name, PRESET_JSON);
  return fs.existsSync(presetPath);
}
