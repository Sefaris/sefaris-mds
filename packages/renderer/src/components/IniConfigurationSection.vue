<template>
  <div class="mt-2 select-none text-center text-xl">{{ $props.section.name }}</div>
  <component
    :is="display.component!"
    v-for="(display, index) in displays"
    :key="index"
    :option="display.option"
    @update-option="handleUpdateSection"
  />
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import type { PropType } from 'vue';
import type { ConfigSection } from '@interfaces/ConfigSection';
import DisplayBooleanOption from './DisplayOptions/DisplayBooleanOption.vue';
import DisplayStringOption from './DisplayOptions/DisplayStringOption.vue';
import DisplayNumberOption from './DisplayOptions/DisplayNumberOption.vue';
import DisplayKeyboardOption from './DisplayOptions/DisplayKeyboardOption.vue';
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
  emits: ['updateSection'],
  setup(props, { emit }) {
    const configSection = toRef(props.section);
    console.log(configSection.value);

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
        case 'keyboard':
          return DisplayKeyboardOption;
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

    const handleUpdateSection = (option: { key: string; value: number }) => {
      const foundOption = configSection.value.options.find(opt => opt.name === option.key);

      if (foundOption) {
        foundOption.value = option.value;
      } else {
        console.warn(`Option with key ${option.key} not found.`);
      }
      emit('updateSection', configSection.value);
    };

    return {
      displays,
      configSection,
      handleUpdateSection,
    };
  },
});
</script>
