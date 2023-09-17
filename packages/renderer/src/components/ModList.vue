<template>
  <div class="list-container">
    <ModItem
      v-for="(mod, index) in mods"
      :key="index"
      :mod-item="mod"
    />
  </div>
</template>

<script lang="ts">
import type {Mod} from '#preload';
import {defineComponent} from 'vue';
import ModItem from './ModItem.vue';

export default defineComponent({
  components: {ModItem},
  props: {
    modList: {
      type: Array<Mod>,
      required: true,
    },
  },
  setup(props) {
    return {mods: props.modList};
  },
});
</script>

<style lang="scss">
.list-container {
  display: flex;
  flex-direction: column;
  flex-basis: 40%;
}
</style>
