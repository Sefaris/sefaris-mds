import type { ConfigSection } from './ConfigSection';

export interface ConfigRecord {
  name: string;
  sections: ConfigSection[];
}
