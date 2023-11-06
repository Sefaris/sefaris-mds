<template>
  <title-bar />
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TitleBar from './components/TitleBar.vue';

export default defineComponent({
  components: { TitleBar },
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
@import '../assets/styles/main.scss';

#app {
  height: calc(100vh - 30px);
  max-width: 100vw;
}
</style>
