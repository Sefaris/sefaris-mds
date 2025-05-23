<template>
  <div class="mt-2 select-none text-center text-xl">{{ $props.section.name }}</div>
  <component
    :is="display.component!"
    v-for="(display, index) in displays"
    :key="index"
    :option="display.option"
  />
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import type { PropType } from 'vue';
import type { ConfigSection } from '@interfaces/ConfigSection';
import DisplayBooleanOption from './DisplayOptions/DisplayBooleanOption.vue';
import DisplayStringOption from './DisplayOptions/DisplayStringOption.vue';
import DisplayNumberOption from './DisplayOptions/DisplayNumberOption.vue';
import DisplayKeyOption from './DisplayOptions/DisplayKeyOption.vue';
import DisplayModeOption from './DisplayOptions/DisplayModeOption.vue';
import DisplayArrayStringOption from './DisplayOptions/DisplayArrayStringOption.vue';
import DisplayArrayNumberOption from './DisplayOptions/DisplayArrayNumberOption.vue';
import DisplayArrayBooleanOption from './DisplayOptions/DisplayArrayBooleanOption.vue';
import type { OptionType } from '../../../../types/OptionType';
import type { OptionComponent } from '../../../../types/OptionComponent';

export default defineComponent({
  props: {
    section: {
      type: Object as PropType<ConfigSection>,
      required: true,
    },
  },
  setup(props) {
    const configSection = toRef(props.section);
    const getComponentType = (type: OptionType): OptionComponent | undefined => {
      switch (type) {
        case 'boolean':
          return DisplayBooleanOption;
        case 'string':
          return DisplayStringOption;
        case 'number':
          return DisplayNumberOption;
        case 'mode':
          return DisplayModeOption;
        case 'key':
          return DisplayKeyOption;
        case 'arrayType:string':
          return DisplayArrayStringOption;
        case 'arrayType:number':
          return DisplayArrayNumberOption;
        case 'arrayType:boolean':
          return DisplayArrayBooleanOption;
        default:
          console.error(`Unknown type: ${type}`);
          return undefined;
      }
    };

    const displays = props.section.options.map(option => ({
      component: getComponentType(option.type),
      option,
    }));

    return {
      displays,
      configSection,
    };
  },
});
</script>
