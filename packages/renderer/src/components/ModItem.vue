<template>
  <div class="mod">
    <input
      class="mod-checkbox"
      type="checkbox"
      :checked="checked"
      @click="onChange"
    />

    <span
      class="mod-title"
      @click="$emit('modDetails')"
    >
      {{ mod.title }}
    </span>
  </div>
</template>

<script lang="ts">
import type { Mod } from '#preload';

import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {},

  props: {
    checked: {
      type: Boolean,
      required: true,
    },

    mod: {
      type: Object as PropType<Mod>,
      required: true,
    },
  },

  emits: ['modDetails', 'change'],

  setup(_, { emit }) {
    function onChange(event: Event) {
      if (!event.target) {
        return;
      }

      emit('change', (event.target as HTMLInputElement).checked);
    }

    return {
      onChange,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.mod {
  display: flex;
  gap: 0.25rem;

  &-title {
    cursor: pointer;
  }
}
</style>
