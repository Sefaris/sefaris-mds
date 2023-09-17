<template>
  <div class="mod">
    <input
      class="mod-checkbox"
      type="checkbox"
    />
    <span class="mod-title">
      {{ mod.title }}
    </span>
  </div>
</template>

<script lang="ts">
import type {Mod} from '#preload';
import {defineComponent} from 'vue';

export default defineComponent({
  components: {},
  props: {
    modItem: {
      type: Object as () => Mod,
      required: true,
    },
  },
  setup(props) {
    return {mod: props.modItem};
  },
});
</script>

<style lang="scss">
.mod {
  display: flex;
  gap: 0.25rem;
  &-checkbox {
  }

  &-title {
  }
}
</style>
