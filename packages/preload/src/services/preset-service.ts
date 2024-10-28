import { ensureDirectory } from './file-service';
import path from 'path';
import * as fs from 'fs';
import type { Preset } from '../../../../interfaces/Preset';
import { PRESETS_DIRECTORY, UTF8 } from '../../../../utils/constants';
import { loggerError, loggerInfo } from './logger-service';
import { getMessage } from '../../../../utils/messages';
import { loadConfiguration } from './configuration-service';
import { ConfigurationError } from '../../../../Errors/ConfigurationError';
const PRESET_JSON = 'preset.json';

export async function getPresetsPath() {
  const config = await loadConfiguration();
  if (!config) throw new ConfigurationError(getMessage('MISSING_CONFIGURATION'));
  return path.join(config.gothicPath, PRESETS_DIRECTORY);
}

export async function savePreset(modIds: string[], name: string) {
  const presetsDirPath = await getPresetsPath();
  const presetPath = path.join(presetsDirPath, name);

  if (!modIds.length) {
    throw new Error(getMessage('PRESET_EMPTY_MODS'));
  }
  if (!name.length) {
    throw new Error(getMessage('PRESET_EMPTY_NAME'));
  }

  ensureDirectory(presetsDirPath);
  ensureDirectory(presetPath);

  const preset: Preset = {
    name,
    modIds,
  };

  const presetJsonPath = path.join(presetPath, PRESET_JSON);

  fs.writeFileSync(presetJsonPath, JSON.stringify(preset, null, 2));
  loggerInfo(getMessage('PRESET_CREATED', { name: name }));
}

export async function getAllPresets(): Promise<Preset[]> {
  const presets: Preset[] = [];
  const presetsPath = await getPresetsPath();
  ensureDirectory(presetsPath);
  const presetsDirs = fs.readdirSync(presetsPath);
  presetsDirs.forEach(dir => {
    const jsonPath = path.join(presetsPath, dir, PRESET_JSON);
    if (!fs.existsSync(jsonPath)) {
      loggerError(getMessage('PRESET_MISSING_JSON', { name: dir }));
      return;
    }
    const preset: Preset = JSON.parse(fs.readFileSync(jsonPath, UTF8));
    if (!isPresetValid(preset)) {
      loggerError(getMessage('PRESET_INVALID', { name: dir }));
      return;
    }
    presets.push(preset);
  });
  return presets;
}

export function isPresetValid(preset: Preset): boolean {
  return (
    typeof preset.name === 'string' && Array.isArray(preset.modIds) && preset.modIds.length > 0
  );
}
