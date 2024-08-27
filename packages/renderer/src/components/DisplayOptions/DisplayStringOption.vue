<template>
  <display-base-option :option="$props.option">
    <span
      v-if="!editing"
      class="h-6 cursor-pointer hover:text-menu-hover"
      @click="editing = true"
    >
      {{ setting.value }}
    </span>
    <input
      v-else
      ref="input"
      v-model="setting.value"
      class="h-6 min-w-40 border-2 border-divider bg-transparent"
      type="text"
      @focusout="editing = false"
    />
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref, toRef, watchEffect } from 'vue';
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
    const editing = ref(false);
    const input = ref<HTMLElement | null>(null);

    watchEffect(() => {
      if (editing.value && input.value) {
        input.value.focus();
      }
    });

    return { setting, editing, input };
  },
});
</script>
