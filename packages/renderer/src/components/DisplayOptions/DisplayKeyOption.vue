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
import { GOTHIC_KEYS, KEY_MAP } from '../../../../../utils/constants';

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

    const handleKeydown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      const mappedKey = KEY_MAP[event.code] || key;

      if (GOTHIC_KEYS.includes(mappedKey)) {
        isListening.value = false;
        setting.value.value = mappedKey;
        window.removeEventListener('keydown', handleKeydown);
      }
    };

    const onRebind = () => {
      isListening.value = true;

      window.addEventListener('keydown', handleKeydown);
    };

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown);
    });

    return { setting, isListening, onRebind };
  },
});
</script>
