export const Messages = {
  WRONG_PATH: "Gothic3.exe wasn't found. Select correct directory.",
  CONFIG_NOT_FOUND: 'Config not found or corrupted. Select Gothic 3 directory.',
  MODJSON_NOT_FOUND: 'mod.json not found in',
  WRONG_JSON_STRUCTURE: 'Wrong json structure for {{mod}}',
  NO_MODS_SELECTED: 'No mods selected!',
  MODS_NOT_FOUND: 'No mods were found in {{path}}',
  MODS_MISSING_TITLE_ID: "Mod in {{mod}} doesn't have id or title",
  GOTHIC_EXE_NOT_FOUND: "Gothic3.exe wasn't found.",
  GAME_START_FAILED: 'Failed to start the game:',

  MODS_INSTALLED: 'Mods succesfully installed in',
  MOD_NO_README_LOCALE: 'No readme_{{locale}} for {{name}}',
  INI_MISSING_DESC_TYPE: 'Expected description and type in {{name}}:Lines:{{beg}}-{{end}}!',
  INI_EMPTY_DESC: 'Expected non empty description in {{name}}:Line:{{line}}!',
  INI_EMPTY_TYPE: 'Expected type in {{name}}:Line:{{line}}!',

  INI_VALUE_CONVERSTION_FAIL: 'Value conversion failed in {{name}}:Line:{{line}}!',
  INI_DEFAULT_VALUE_CONVERSTION_FAIL: 'Default value conversion failed in {{name}}:Line:{{line}}!',
  INI_RANGES_CONVERSTION_FAIL: 'Ranges conversion failed in {{name}}:Line:{{line}}!',
  INI_RANGES_NOT_FOUND: 'Ranges not found in {{name}}:Line:{{line}}!',
  INI_UNSUPPORTED_ARRAY_TYPE: 'Unsupported arraytype {{type}}',
  INI_UNSUPPORTED_TYPE: 'Unsupported type {{type}}',

  INI_NO_DATA_TO_SAVE: 'No data to save!',
  INI_NOT_FOUND: 'Ini for {{name}} not found!',

  CONFIGURATION_SAVED: 'Configuration succesfully saved!',
  INVALID_CONFIGURATION: 'Invalid configuration!',
  MISSING_CONFIGURATION: 'Missing configuration file!',

  FILE_DOESNT_EXIST: "File {{path}} doesn't exist.",
  FILE_DELETING: 'Deleting {{path}} file.',
  FILE_DELETED: '{{path}} deleted.',

  PRESET_LOADED: 'Preset {{name}} loaded.',
  PRESET_NOT_FOUND: 'Preset not found: ',
  MISSING_MODS_FROM_PRESET: 'Missing mods from preset:',
  PRESET_INVALID: 'Preset {{name}} is invalid.',
  PRESET_MISSING_JSON: 'Missing json for {{name}}.',

  INSTALLATION_START: 'Installing {{num}} mods started!',
  INSTALLATION_MOD_LIST: 'Mods to install: {{mods}}',
  INSTALLATION_FAIL: 'Instalation failed!',
  INSTALLATION_COMPLETE: 'Installing {{num}} mods completed!',
  REVERT_INSTALLATION_CHANGES: 'Reverting installation changes.',
  REVERT_NOTHING_TO_DO: 'No changes to revert!',
  REVERT_COMPLETE: 'Revert complete!',

  COPY_FILE_FROM_TO: 'Copying {{src}} to {{dst}}',
  COPY_FILE_FROM_TO_COMPLETE: 'Succesfully copied {{src}} to {{dst}}',

  MOVE_SAVES_START: 'Moving old saves to new directory.',
  MOVE_SAVES_NOTHING_TO_MOVE: 'No saves to move!',
  MOVE_SAVES_FROM_TO: 'Moving {{src}} to {{dst}}',
  MOVE_SAVES_FROM_TO_COMPLETE: 'Succesfully moved {{src}} to {{dst}}',
  MOVE_SAVES_COMPLETE: 'Moving saves complete!',

  COPY_SPLASH_START: 'Copying splash.',
  COPY_SPLASH_NOT_FOUND: 'Splash not found in preset {{preset}}',
  COPY_SPLASH_COMPLETE: 'Splash succesfully copied.',

  COPY_SHADER_START: 'Copying Shader.Cache.',
  COPY_SHADER_NOT_FOUND: 'Shader.Cache not found in preset {{preset}}',
  COPY_SHADER_COMPLETE: 'Shader.Cache succesfully copied.',

  DIRECTORY_CREATE: 'Creating directory {{path}}',
  DIRECTORY_CREATED: 'Directory created.',
};

type MessageKey = keyof typeof Messages;

export function getMessage(messageKey: MessageKey, variables?: Record<string, string>) {
  let message = Messages[messageKey];

  if (variables) {
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      message = message.replace(regex, value);
    }
  }

  return message;
}
