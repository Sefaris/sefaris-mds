export interface AppConfiguration {
  gothicPath: string;
  modsPath?: string;
  language: string;
  preset?: string;
  ignoreDependencies: boolean;
  ignoreIncompatible: boolean;
  installedMods: string[];
  filesCreated: string[];
}
