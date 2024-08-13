<template>
  <display-base-option :option="$props.option">
    <div class="flex flex-col">
      <div
        v-for="(mode, index) in setting.modes!"
        :key="index"
        class="flex gap-5"
      >
        <button
          class="h-6.5 w-6.5"
          :class="[setting.value === mode ? 'bg-checkbox-active' : 'bg-checkbox-inactive']"
          @click="onModeChange(mode)"
        >
        </button>
        <span class="min-w-40 text-left">
          {{ mode }}
        </span>
      </div>
    </div>
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, toRef } from 'vue';
import type { ConfigOption } from '@interfaces/ConfigOption';
import DisplayBaseOption from './DisplayBaseOption.vue';

export default defineComponent({
  components: { DisplayBaseOption },

  props: {
    option: {
      type: Object as PropType<ConfigOption>,
      required: true,
    },
  },
  emits: ['updateOption'],
  setup(props) {
    const setting = toRef(props.option);

    const onModeChange = (mode: string) => {
      setting.value.value = mode;
    };

    return { setting, onModeChange };
  },
});
</script>
