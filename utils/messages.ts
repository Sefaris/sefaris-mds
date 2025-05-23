export const Messages = {
  WRONG_PATH: "Gothic3.exe wasn't found. Select correct directory.",
  CONFIG_NOT_FOUND: 'Config not found or corrupted. Select Gothic 3 directory.',
  MOD_JSON_NOT_FOUND: 'mod.json not found in',
  DATA_DIR_DOESNT_EXIST: "Data folder doesn't exist!",
  WRONG_JSON_STRUCTURE: 'Wrong json structure for {{mod}}',
  NO_MODS_SELECTED: 'No mods selected!',
  MODS_NOT_FOUND: 'No mods were found in {{path}}',
  MODS_MISSING_TITLE_ID: "Mod in {{mod}} doesn't have id or title",
  GOTHIC_EXE_NOT_FOUND: "Gothic3.exe wasn't found.",
  GAME_START_FAILED: 'Failed to start the game:',
  FILE_NOT_FOUND: '{{name}} not found!',

  DEPENDENCY_NOT_FOUND: 'Dependency {{name}} not found!',
  MOD_NOT_FOUND: 'Mod {{name}} not found!',
  MODS_INSTALLED: 'Mods successfully installed in',
  MODS_DELETED: 'Mods successfully deleted.',
  MOD_NO_README_LOCALE: 'No readme_{{locale}} for {{name}}',
  INI_MISSING_DESC_TYPE: 'Expected description and type in {{name}}:Lines:{{beg}}-{{end}}!',
  INI_EMPTY_DESC: 'Expected non empty description in {{name}}:Line:{{line}}!',
  INI_EMPTY_TYPE: 'Expected type in {{name}}:Line:{{line}}!',

  INI_VALUE_CONVERSION_FAIL: 'Value conversion failed in {{name}}:Line:{{line}}!',
  INI_DEFAULT_VALUE_CONVERSION_FAIL: 'Default value conversion failed in {{name}}:Line:{{line}}!',
  INI_RANGES_CONVERSION_FAIL: 'Ranges conversion failed in {{name}}:Line:{{line}}!',
  INI_RANGES_NOT_FOUND: 'Ranges not found in {{name}}:Line:{{line}}!',
  INI_UNSUPPORTED_ARRAY_TYPE: 'Unsupported arraytype {{type}}',
  INI_UNSUPPORTED_TYPE: 'Unsupported type {{type}}',

  INI_NO_DATA_TO_SAVE: 'No data to save!',
  INI_NOT_FOUND: 'Ini for {{name}} not found!',
  INI_NOT_FOUND_IN_CONFIG: '{{name}} not found in config!',

  CONFIGURATION_SAVED: 'Configuration successfully saved!',
  INVALID_CONFIGURATION: 'Invalid configuration!',
  MISSING_CONFIGURATION: 'Missing configuration file!',

  DIRECTORY_DOESNT_EXIST: "Directory {{path}} doesn't exist.",
  FILE_DOESNT_EXIST: "File {{path}} doesn't exist.",
  FILE_SKIPPED: "File {{path}} doesn't exist. Skipped.",
  FILE_DELETING: 'Deleting {{path}} file.',
  FILE_DELETED: '{{path}} deleted.',

  PRESET_CREATED: 'Preset {{name}} successfully created.',
  PRESET_LOADED: 'Preset {{name}} loaded.',
  PRESET_NOT_FOUND: 'Preset not found: ',
  MISSING_MODS_FROM_PRESET: 'Missing mods from preset:',
  PRESET_EMPTY_NAME: 'Missing name for preset.',
  PRESET_EMPTY_MODS: "Can't create empty preset.",
  PRESET_ALREADY_EXISTS: 'Preset {{name}} already exists.',
  PRESET_INVALID: 'Preset {{name}} is invalid.',
  PRESET_MISSING_JSON: 'Missing json for {{name}}.',

  INSTALLATION_START: 'Installing {{num}} mods started!',
  INSTALLATION_MOD_LIST: 'Mods to install: {{mods}}',
  INSTALLATION_FAIL: 'Installation failed!',
  INSTALLATION_COMPLETE: 'Installing {{num}} mods completed!',
  REVERT_INSTALLATION_CHANGES: 'Reverting installation changes.',
  REVERT_NOTHING_TO_DO: 'No changes to revert!',
  REVERT_COMPLETE: 'Revert complete!',

  COPY_FILE_FROM_TO: 'Copying {{src}} to {{dst}}',
  COPY_FILE_FROM_TO_COMPLETE: 'Successfully copied {{src}} to {{dst}}',

  MOVE_SAVES_START: 'Moving old saves to new directory.',
  MOVE_SAVES_NOTHING_TO_MOVE: 'No saves to move!',
  MOVE_SAVES_FROM_TO: 'Moving {{src}} to {{dst}}',
  MOVE_SAVES_FROM_TO_COMPLETE: 'Successfully moved {{src}} to {{dst}}',
  MOVE_SAVES_COMPLETE: 'Moving saves complete!',

  COPY_SPLASH_START: 'Copying splash.',
  COPY_SPLASH_NOT_FOUND: 'Splash not found in preset {{preset}}',
  COPY_SPLASH_COMPLETE: 'Splash successfully copied.',

  COPY_SHADER_START: 'Copying Shader.Cache.',
  COPY_SHADER_NOT_FOUND: 'Shader.Cache not found in preset {{preset}}',
  COPY_SHADER_COMPLETE: 'Shader.Cache successfully copied.',

  DIRECTORY_CREATE: 'Creating directory {{path}}',
  DIRECTORY_CREATED: 'Directory created.',

  CHECK_LOG_FILE: 'Something went wrong.\nCheck Documents/Gothic3/Starter.log.',
};

export type MessageKey = keyof typeof Messages;

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
