import * as fs from 'fs';
import * as path from 'path';
import { loadConfiguration } from './configuration-service';
import { ensureDirectory } from './file-service';
import type { ConfigValue } from '../../../../types/ConfigValue';
import type { ConfigSection } from '../../../../interfaces/ConfigSection';
import type { OptionType } from '../../../../types/OptionType';
import { UTF8 } from '../../../../utils/constants';
import { ConversionError } from '../../../../Errors/ConversionError';
import { loggerError } from './logger-service';
import { getMessage } from '../../../../utils/messages';
import { ConfigurationError } from '../../../../Errors/ConfigurationError';
import { NotFoundError } from '../../../../Errors/NotFoundError';

export function parseConfig(configText: string, name: string): ConfigSection[] {
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
          throw new ConversionError(
            getMessage('INI_MISSING_DESC_TYPE', {
              name: name,
              beg: (i + 2).toString(),
              end: (i + 3).toString(),
            }),
          );
        }

        const descriptionLine = lines[i + 1].replace(/^\s*;\s*/, '').trim() || '';
        const typeLine = lines[i + 2].replace(/^\s*;\s*/, '').trim() || '';
        let optionalLine: string = '';
        // dont throw error for optional line
        if (lines[i + 3]) {
          if (lines[i + 3].includes('|') && !lines[i + 3].includes('=')) {
            optionalLine = lines[i + 3].replace(/^\s*;\s*/, '') || '';
          }
        }
        if (!descriptionLine.length) {
          throw new ConversionError(
            getMessage('INI_EMPTY_DESC', {
              name: name,
              line: (i + 2).toString(),
            }),
          );
        }
        if (!typeLine.length) {
          throw new ConversionError(
            getMessage('INI_EMPTY_TYPE', {
              name: name,
              line: (i + 3).toString(),
            }),
          );
        }
        const typeString = typeLine.split(',');
        let parsedValue: ConfigValue = value.trim();
        let parsedDefaultValue: ConfigValue = typeString.at(-1)!.trim();
        let modes: string[] | undefined = undefined;
        let ranges: number[] | undefined = undefined;
        switch (typeString[0].toLowerCase()) {
          case 'string':
          case 'key':
            break;
          case 'mode':
            modes = optionalLine.split('|').map(mode => mode.trim());
            break;
          case 'boolean':
            if (parsedValue != 'true' && parsedValue != 'false')
              throw new ConversionError(
                getMessage('INI_VALUE_CONVERSTION_FAIL', {
                  name: name,
                  line: (i + 1).toString(),
                }),
              );
            if (parsedDefaultValue != 'true' && parsedDefaultValue != 'false')
              throw new ConversionError(
                getMessage('INI_DEFAULT_VALUE_CONVERSTION_FAIL', {
                  name: name,
                  line: (i + 2).toString(),
                }),
              );
            parsedValue = value.toLowerCase() === 'true';
            parsedDefaultValue = parsedDefaultValue.toLowerCase() === 'true';
            break;
          case 'number':
            if (!optionalLine.length)
              throw new ConversionError(
                getMessage('INI_RANGES_NOT_FOUND', {
                  name: name,
                  line: (i + 4).toString(),
                }),
              );
            ranges = optionalLine.split('|').map(range => parseFloat(range.trim()));
            if (ranges.includes(NaN))
              throw new ConversionError(
                getMessage('INI_RANGES_CONVERSTION_FAIL', {
                  name: name,
                  line: (i + 4).toString(),
                }),
              );
            parsedValue = parseFloat(value);
            if (Number.isNaN(parsedValue))
              throw new ConversionError(
                getMessage('INI_VALUE_CONVERSTION_FAIL', {
                  name: name,
                  line: (i + 1).toString(),
                }),
              );
            parsedDefaultValue = parseFloat(parsedDefaultValue);
            if (Number.isNaN(parsedDefaultValue))
              throw new ConversionError(
                getMessage('INI_DEFAULT_VALUE_CONVERSTION_FAIL', {
                  name: name,
                  line: (i + 2).toString(),
                }),
              );

            break;
          case 'array':
            parsedValue = value.split(';').filter(item => item.length);
            parsedDefaultValue = parsedDefaultValue.split(';').filter(item => item.length);
            if (typeString[1].trim() === 'arrayType:number') {
              parsedValue = parsedValue.map(item => parseFloat(item));
              if (parsedValue.includes(NaN))
                throw new ConversionError(
                  getMessage('INI_VALUE_CONVERSTION_FAIL', {
                    name: name,
                    line: (i + 1).toString(),
                  }),
                );
              parsedDefaultValue = parsedDefaultValue.map(item => parseFloat(item));
              if (parsedDefaultValue.includes(NaN))
                throw new ConversionError(
                  getMessage('INI_DEFAULT_VALUE_CONVERSTION_FAIL', {
                    name: name,
                    line: (i + 2).toString(),
                  }),
                );
            } else if (typeString[1].trim() !== 'arrayType:string') {
              throw new ConversionError(
                getMessage('INI_UNSUPPORTED_ARRAY_TYPE', {
                  type: typeString[1],
                }),
              );
            }
            break;
          default:
            throw new ConversionError(
              getMessage('INI_UNSUPPORTED_TYPE', {
                type: typeString[0],
              }),
            );
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
      loggerError(err as string);
    }
  }

  if (currentSection && currentSection.options.length) {
    configSections.push(currentSection);
  }

  return configSections;
}
export async function validateIniFile(name: string) {
  const config = await loadIniConfiguration(name);
  // ensure there is at least one valid option to edit
  return config && config.length > 0;
}

export async function loadIniConfiguration(name: string) {
  const config = await loadConfiguration();
  if (!config) throw new ConfigurationError(getMessage('MISSING_CONFIGURATION'));
  const iniPath = path.join(config.gothicPath, 'ini');
  ensureDirectory(iniPath);

  let iniFilePath = config.filesCreated.find(file => file.includes(name));
  if (name === 'ge3.ini') {
    iniFilePath = path.join(iniPath, 'ge3.ini');
  }
  if (!iniFilePath) throw new NotFoundError(getMessage('INI_NOT_FOUND_IN_CONFIG', { name: name }));
  if (!fs.existsSync(iniFilePath))
    throw new NotFoundError(getMessage('FILE_NOT_FOUND', { name: name }));
  const configFileContent = fs.readFileSync(iniFilePath, UTF8);
  return parseConfig(configFileContent, name);
}

export async function saveIniConfiguration(sections: ConfigSection[], name: string) {
  const config = await loadConfiguration();
  if (!config) throw new ConfigurationError(getMessage('MISSING_CONFIGURATION'));
  const iniPath = path.join(config.gothicPath, 'ini');
  ensureDirectory(iniPath);

  let iniFilePath = config.filesCreated.find(file => file.includes(name));
  if (name === 'ge3.ini') {
    iniFilePath = path.join(iniPath, 'ge3.ini');
  }
  if (!iniFilePath)
    throw new NotFoundError(
      getMessage('INI_NOT_FOUND', {
        name: name,
      }),
    );
  if (!sections.length) throw new NotFoundError(getMessage('INI_NO_DATA_TO_SAVE'));

  const iniFileLines = fs.readFileSync(iniFilePath, UTF8).split('\n');

  sections.forEach(section => {
    section.options.forEach(option => {
      const foundIndex = iniFileLines.findIndex(line => line.split('=')[0].trim() == option.name);
      let savedLine = `${option.name}=${option.value}`;
      if (option.type.includes('arrayType')) {
        savedLine = `${option.name}=${(option.value as Array<string>).join(';')}`;
      }
      iniFileLines[foundIndex] = savedLine;
    });
  });
  const outputPath = path.join(iniPath, name);

  fs.writeFileSync(outputPath, iniFileLines.join('\n'), { flag: 'w+' });
}

export async function getAllIniNames() {
  const config = await loadConfiguration();
  if (!config) throw new ConfigurationError(getMessage('MISSING_CONFIGURATION'));

  const iniFiles = config.filesCreated
    .filter(file => file.endsWith('.ini'))
    .map(item => path.parse(item).base);
  // ensure at least one valid option exist
  const validationResults = await Promise.all(iniFiles.map(file => validateIniFile(file)));

  return iniFiles.filter((_, index) => validationResults[index]);
}
