import type { AppConfiguration } from '../interfaces/AppConfiguration';

/**
 * Optional payload attached to ConfigurationError so the renderer can recover
 * the previous configuration (e.g. when only `gothicPath` is invalid and the
 * user wants to keep `installedMods`, `filesCreated`, presets, etc.).
 */
export class ConfigurationError extends Error {
  public readonly config?: AppConfiguration;

  constructor(message: string, config?: AppConfiguration) {
    super(message);
    this.name = 'ConfigurationError';
    this.config = config;
  }
}
