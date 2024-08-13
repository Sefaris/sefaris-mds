<template>
  <display-base-option
    class="flex"
    :option="setting"
  >
    <div class="flex items-center">
      <option-boolean-slider
        :min="0"
        :max="1"
        :value="setting.value ? true : false"
        @slide="(n: boolean) => $emit('updateOption', { key: setting.name, value: n })"
      />
      <span
        v-if="setting.value"
        class="min-w-50 text-right"
      >
        {{ $t('config.option.on') }}
      </span>
      <span
        v-else
        class="min-w-50 text-right"
      >
        {{ $t('config.option.off') }}
      </span>
    </div>
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, toRef } from 'vue';
import type { ConfigOption } from '@interfaces/ConfigOption';
import DisplayBaseOption from './DisplayBaseOption.vue';
import OptionBooleanSlider from '../OptionSliders/OptionBooleanSlider.vue';

export default defineComponent({
  components: { DisplayBaseOption, OptionBooleanSlider },
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
