<template>
  <display-base-option :option="$props.option">
    <div class="flex items-center">
      <option-number-slider
        :min="setting.ranges![0] ?? 0"
        :max="setting.ranges![1] ?? 100"
        :step="setting.ranges![2] ?? 1"
        :value="Number(setting.value)"
        @slide="onValueChange"
      />

      <span
        v-if="!editing"
        class="hover:text-menu-hover h-6 min-w-50 cursor-pointer text-right"
        @click="startEditing"
      >
        {{ setting.value }}
      </span>
      <input
        v-else
        ref="input"
        :value="setting.value"
        type="number"
        :min="setting.ranges![0] ?? undefined"
        :max="setting.ranges![1] ?? undefined"
        :step="setting.ranges![2] ?? 1"
        class="border-divider h-6 min-w-50 border-2 bg-transparent text-right"
        @change="onInputChange"
        @focusout="editing = false"
        @keydown.enter="onEnter"
      />
    </div>
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref, toRef, watchEffect } from 'vue';
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
  setup(props) {
    const setting = toRef(props.option);
    const editing = ref(false);
    const input = ref<HTMLInputElement | null>(null);

    watchEffect(() => {
      if (editing.value && input.value) {
        input.value.focus();
        input.value.select();
      }
    });

    const clamp = (n: number) => {
      const min = setting.value.ranges?.[0];
      const max = setting.value.ranges?.[1];
      let v = n;
      if (typeof min === 'number' && v < min) v = min;
      if (typeof max === 'number' && v > max) v = max;
      return v;
    };

    const onValueChange = (n: number) => {
      setting.value.value = clamp(n);
    };

    const onInputChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const raw = target.value.trim();
      const parsed = Number(raw);
      if (raw === '' || Number.isNaN(parsed)) {
        target.value = String(setting.value.value);
        return;
      }
      const v = clamp(parsed);
      setting.value.value = v;
      target.value = String(v);
    };

    const startEditing = () => {
      editing.value = true;
    };

    const onEnter = (e: KeyboardEvent) => {
      (e.target as HTMLInputElement).blur();
    };

    return { setting, editing, input, onValueChange, onInputChange, startEditing, onEnter };
  },
});
</script>
