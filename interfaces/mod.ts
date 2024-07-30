export interface Mod {
  id: string;
  title: string;
  dependencies: string[];
  incompatibles: string[];
  directoryName: string;
  authors: string[];
  path: string;
}
