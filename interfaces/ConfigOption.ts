import type { ConfigValue } from '../types/ConfigValue';
import type { OptionType } from '../types/OptionType';

export interface ConfigOption {
  name: string;
  description: string;
  value: ConfigValue;
  type: OptionType;
  defaultValue: ConfigValue;
  modes?: string[];
}
