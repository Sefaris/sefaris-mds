<template>
  <span :class="name"></span>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const name = ref(`mdi ${props.icon}`);
    return {
      name,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.mdi {
  font-size: $font-size-icon;
}
</style>
