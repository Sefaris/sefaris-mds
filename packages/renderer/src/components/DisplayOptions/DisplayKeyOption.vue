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

    const handleKeydown = (event: KeyboardEvent) => {
      isListening.value = false;
      setting.value.value = event.key.toUpperCase();
      window.removeEventListener('keydown', handleKeydown);
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
