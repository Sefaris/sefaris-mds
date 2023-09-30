<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="details">
    <!-- <img
      v-if="img"
      :src="img"
    /> -->
    <div v-html="desc"></div>
  </div>
</template>

<script lang="ts">
import {loadModDescription, loadImage} from '#preload';
import type {Mod} from '#preload';
import {defineComponent, ref, watch} from 'vue';

export default defineComponent({
  components: {},
  props: {
    modItem: {
      type: Object as () => Mod,
      required: true,
    },
  },
  setup(props) {
    const clonedMod: Mod = JSON.parse(JSON.stringify(props.modItem));
    const desc = ref(loadModDescription(clonedMod));
    const img = ref(loadImage(clonedMod));

    watch(
      () => props.modItem,
      newMod => {
        const clonedNewMod: Mod = JSON.parse(JSON.stringify(newMod));
        desc.value = loadModDescription(clonedNewMod);
        img.value = loadImage(clonedNewMod);
      },
    );

    return {mod: props.modItem, desc, img};
  },
});
</script>

<style lang="scss">
.details {
  flex: 0 0 60%;
}
</style>
