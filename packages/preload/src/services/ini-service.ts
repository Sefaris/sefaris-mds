import * as fs from 'fs';
import * as path from 'path';
import { loadConfiguration } from './configuration-service';
import { ensureDirectory } from './file-service';
import type { ConfigValue } from '../../../../types/ConfigValue';
import type { ConfigSection } from '../../../../interfaces/ConfigSection';
import type { OptionType } from '../../../../types/OptionType';

function parseConfig(configText: string, name: string): ConfigSection[] {
  const lines = configText.split('\n');
  const configSections: ConfigSection[] = [];
  let currentSection: ConfigSection | null = null;

  for (let i = 0; i < lines.length; i++) {
    try {
      const line = lines[i].trim();
      // detect a new section
      if (line.startsWith('[') && line.endsWith(']')) {
        if (currentSection?.options.length) {
          configSections.push(currentSection);
        }
        currentSection = { name: line.slice(1, -1), options: [] };
      }

      // detect an option with value
      if (line.includes('=')) {
        const [option, value] = line.split('=');
        if (!lines[i + 1].includes(';') || !lines[i + 2].includes(';')) {
          throw `Expected description and type in ${name}:Lines:${i + 1}-${i + 2}!`;
        }

        const descriptionLine = lines[i + 1].replace(/^\s*;\s*/, '').trim() || '';
        const typeLine = lines[i + 2].replace(/^\s*;\s*/, '').trim() || '';
        let modesLine: string = '';
        // dont throw error for optional line
        if (lines[i + 3]) {
          if (lines[i + 3].includes('|') && !lines[i + 3].includes('=')) {
            modesLine = lines[i + 3].replace(/^\s*;\s*/, '') || '';
          }
        }
        if (!descriptionLine.length) {
          throw `Expected non empty description in ${name}:Line:${i}!`;
        }
        if (!typeLine.length) {
          throw `Expected type in ${name}:Line:${i}!`;
        }
        const typeString = typeLine.split(',');
        let parsedValue: ConfigValue = value;
        let parsedDefaultValue: ConfigValue = typeString.at(-1)!.trim();
        let modes: string[] | undefined = undefined;
        let ranges: number[] | undefined = undefined;
        switch (typeString[0].toLowerCase()) {
          case 'string':
          case 'keyboard':
            break;
          case 'mode':
            modes = modesLine.split('|').map(mode => mode.trim());
            break;
          case 'boolean':
            parsedValue = value.toLowerCase() === 'true';
            parsedDefaultValue = parsedDefaultValue.toLowerCase() === 'true';
            break;
          case 'number':
            ranges = modesLine.split('|').map(range => parseFloat(range.trim()));
            parsedValue = parseFloat(value);
            parsedDefaultValue = parseFloat(parsedDefaultValue);
            break;
          case 'array':
            parsedValue = value.split(';').filter(item => item.length);
            parsedDefaultValue = parsedDefaultValue.split(';').filter(item => item.length);

            if (typeString[1].includes('arrayType:boolean')) {
              parsedValue = parsedValue.map(item => item.toLowerCase() === 'true');
              parsedDefaultValue = parsedDefaultValue.map(item => item.toLowerCase() === 'true');
            } else if (typeString[1].includes('arrayType:number')) {
              parsedValue = parsedValue.map(item => parseFloat(item));
              parsedDefaultValue = parsedDefaultValue.map(item => parseFloat(item));
            }
            break;
          default:
            throw `Unsupported type ${typeString[0]}`;
        }

        currentSection?.options.push({
          name: option.trim(),
          description: descriptionLine,
          value: parsedValue,
          type: typeString.at(-2)!.trim() as OptionType,
          defaultValue: parsedDefaultValue,
          modes: modes,
          ranges: ranges,
        });
      }
    } catch (err) {
      console.error(`Parsing error: ${err}`);
    }
  }

  if (currentSection && currentSection.options.length) {
    configSections.push(currentSection);
  }

  return configSections;
}

export async function getAllIniNames() {
  const config = await loadConfiguration();
  if (!config) return;
  return config.filesCreated
    .filter(file => file.endsWith('.ini'))
    .map(item => path.parse(item).base);
}

export async function loadIniConfiguration(name: string) {
  const config = await loadConfiguration();
  if (!config) return;
  const iniPath = path.join(config.gothicPath, 'ini');
  ensureDirectory(iniPath);

  const iniFilePath = config.filesCreated.find(file => file.includes(name));
  if (!iniFilePath) return;
  return parseConfig(fs.readFileSync(iniFilePath, 'utf-8'), name);
}
