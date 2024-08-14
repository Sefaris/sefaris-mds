import type DisplayBooleanOption from '../packages/renderer/src/components/DisplayOptions/DisplayBooleanOption.vue';
import type DisplayStringOption from '../packages/renderer/src/components/DisplayOptions/DisplayStringOption.vue';
import type DisplayNumberOption from '../packages/renderer/src/components/DisplayOptions/DisplayNumberOption.vue';
import type DisplayKeyOption from '../packages/renderer/src/components/DisplayOptions/DisplayKeyOption.vue';
import type DisplayModeOption from '../packages/renderer/src/components/DisplayOptions/DisplayModeOption.vue';
import type DisplayArrayStringOption from '../packages/renderer/src/components/DisplayOptions/DisplayArrayStringOption.vue';
import type DisplayArrayNumberOption from '../packages/renderer/src/components/DisplayOptions/DisplayArrayNumberOption.vue';
import type DisplayArrayBooleanOption from '../packages/renderer/src/components/DisplayOptions/DisplayArrayBooleanOption.vue';

export type OptionComponent =
  | typeof DisplayBooleanOption
  | typeof DisplayStringOption
  | typeof DisplayNumberOption
  | typeof DisplayKeyOption
  | typeof DisplayModeOption
  | typeof DisplayArrayStringOption
  | typeof DisplayArrayNumberOption
  | typeof DisplayArrayBooleanOption;
