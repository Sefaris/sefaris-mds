export type ModListMode = 'flat' | 'grouped';

export interface UiPreferences {
  modListMode: ModListMode;
}

export interface AppConfiguration {
  gothicPath: string;
  modsPath?: string;
  language: string;
  preset?: string;
  ignoreDependencies: boolean;
  ignoreIncompatible: boolean;
  installedMods: string[];
  filesCreated: string[];
  uiPreferences?: UiPreferences;
}
