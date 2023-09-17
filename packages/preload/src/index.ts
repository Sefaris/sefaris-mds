/**
 * @module preload
 */

export type {AppConfiguration} from './interfaces/app-configuration';
export type {Mod} from './interfaces/mod';
export type {ModDetails} from './interfaces/mod-details';

export {selectGameFolder} from './services/configuration-service';
export {
  isGothicPathValid,
  saveConfiguration,
  loadConfiguration,
} from './services/configuration-service';
