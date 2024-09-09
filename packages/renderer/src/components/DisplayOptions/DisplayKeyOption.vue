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
import { GOTHIC_KEYS } from '../../../../../utils/constants';

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

    const keyMap: { [key: string]: string } = {
      Escape: 'ESC',
      Minus: 'MINUS',
      Equal: 'EQUALS',
      Backspace: 'BACKSPACE',
      Tab: 'TAB',
      BracketLeft: 'LEFT BRACKET',
      BracketRight: 'RIGHT BRACKET',
      Enter: 'RETURN',
      ControlLeft: 'LEFT CTRL',
      Semicolon: 'SEMICOLON',
      Quote: 'APOSTROPHE',
      Backquote: 'GRAVE',
      ShiftLeft: 'LEFT SHIFT',
      Backslash: 'BACKSLASH',
      Comma: 'COMMA',
      Period: 'PERIOD',
      Slash: 'MINUS2',
      ShiftRight: 'RIGHT SHIFT',
      NumpadMultiply: 'NUM MUL',
      AltLeft: 'LEFT ALT',
      Space: 'SPACE',
      CapsLock: 'CAPS LOCK',
      NumpadSubtract: 'NUM SUB',
      NumpadEnter: 'NUM ENTER',
      ControlRight: 'RIGHT CTRL',
      NumpadDivide: 'NUM DIV',
      AltRight: 'RIGHT ALT',
      Pause: 'PAUSE',
      Home: 'HOME',
      ArrowUp: 'CURSOR UP',
      PageUp: 'PAGE UP',
      ArrowLeft: 'CURSOR LEFT',
      ArrowRight: 'CURSOR RIGHT',
      End: 'END',
      ArrowDown: 'CURSOR DOWN',
      PageDown: 'PAGE DOWN',
      Insert: 'INSERT',
      Delete: 'DELETE',
      OSLeft: 'LEFT OS KEY',
      OSRight: 'RIGHT OS KEY',
    };

    const handleKeydown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      const mappedKey = keyMap[event.code] || key;

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
