<template>
  <display-base-option :option="$props.option">
    <span
      v-if="!isListening"
      class="min-w-50 cursor-pointer text-right hover:text-menu-hover"
      @click="onRebind"
    >
      {{ setting.value }}
    </span>
    <span v-else>
      {{ $t('config.option.waitingForKey') }}
    </span>
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, onUnmounted, ref, toRef } from 'vue';
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
  setup(props) {
    const setting = toRef(props.option);
    const isListening = ref(false);

    const cleanupListeners = () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('mousedown', handleMousedown);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      isListening.value = false;
      setting.value.value = event.key;
      cleanupListeners();
    };

    const handleMousedown = (event: MouseEvent) => {
      isListening.value = false;
      switch (event.button) {
        case 0:
          setting.value.value = 'Left Mouse Button';
          break;
        case 1:
          setting.value.value = 'Middle Mouse Button';
          break;
        case 2:
          setting.value.value = 'Right Mouse Button';
          break;
        default:
          setting.value.value = `Mouse Button ${event.button}`;
      }
      cleanupListeners();
    };

    const onRebind = () => {
      isListening.value = true;

      window.addEventListener('keydown', handleKeydown);
      window.addEventListener('mousedown', handleMousedown);
    };

    onUnmounted(() => {
      cleanupListeners();
    });

    return { setting, isListening, onRebind };
  },
});
</script>
