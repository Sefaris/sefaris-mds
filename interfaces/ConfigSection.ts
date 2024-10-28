import type { ConfigOption } from './ConfigOption';

export interface ConfigSection {
  name: string;
  options: ConfigOption[];
}
