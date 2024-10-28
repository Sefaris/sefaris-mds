import { ensureDirectory } from './file-service';
import path from 'path';
import * as fs from 'fs';
import type { Preset } from '@interfaces/Preset';
import { UTF8 } from '../../../../utils/constants';
const PRESET_JSON = 'preset.json';

const PRESETS_PATH = path.resolve('Presets');

export async function getAllPresets(): Promise<Preset[]> {
  const presets: Preset[] = [];
  await ensureDirectory(PRESETS_PATH);
  const presetsDirs = fs.readdirSync(PRESETS_PATH);
  presetsDirs.forEach(dir => {
    const jsonPath = path.join(PRESETS_PATH, dir, PRESET_JSON);
    if (!fs.existsSync(jsonPath)) return;
    const preset: Preset = JSON.parse(fs.readFileSync(jsonPath, UTF8));
    if (!isPresetValid(preset)) return;
    presets.push(preset);
  });
  return presets;
}

export function isPresetValid(preset: Preset): boolean {
  return (
    typeof preset.name === 'string' && Array.isArray(preset.modIds) && preset.modIds.length > 0
  );
}
