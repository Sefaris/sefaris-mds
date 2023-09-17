<template>
  <router-view></router-view>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
@import '../assets/styles/variables.scss';

#app {
  min-height: 861px;
  max-width: 800px;
}
</style>
