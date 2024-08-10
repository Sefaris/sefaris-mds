<template>
  <display-base-option
    class="flex cursor-pointer gap-3"
    :option="setting"
  >
    <option-slider
      :min="0"
      :max="1"
      :value="setting.value as boolean"
      @slide="n => (setting.value = n)"
    />

    <span v-if="setting.value">Wł.</span>
    <span v-else>Wył.</span>
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, toRef } from 'vue';
import type { ConfigOption } from '@interfaces/ConfigOption';
import DisplayBaseOption from './DisplayBaseOption.vue';
import OptionSlider from '../OptionSlider.vue';

export default defineComponent({
  components: { DisplayBaseOption, OptionSlider },
  props: {
    option: {
      type: Object as PropType<ConfigOption>,
      required: true,
    },
  },
  setup(props) {
    const setting = toRef(props.option);
    return { setting };
  },
});
</script>
