<template>
  <display-base-option :option="$props.option">
    <div class="flex items-center">
      <option-number-slider
        :min="setting.ranges![0] ?? 0"
        :max="setting.ranges![1] ?? 100"
        :step="setting.ranges![2] ?? 1"
        :value="Number(setting.value)"
        @slide="(n: number) => $emit('updateOption', { key: setting.name, value: n })"
      />

      <span class="min-w-50 text-right">
        {{ setting.value }}
      </span>
    </div>
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, toRef } from 'vue';
import type { ConfigOption } from '@interfaces/ConfigOption';
import DisplayBaseOption from './DisplayBaseOption.vue';
import OptionNumberSlider from '../OptionSliders/OptionNumberSlider.vue';

export default defineComponent({
  components: { DisplayBaseOption, OptionNumberSlider },

  props: {
    option: {
      type: Object as PropType<ConfigOption>,
      required: true,
    },
  },
  emits: ['updateOption'],
  setup(props) {
    const setting = toRef(props.option);
    return { setting };
  },
});
</script>
