export interface Mod {
  id: string;
  title: string;
  category: string;
  dependencies: string[];
  incompatibles: string[];
  directoryName: string;
  authors: string[];
  path: string;
}
