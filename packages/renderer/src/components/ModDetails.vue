<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="details">
    <!-- TODO: Wczytywanie obrazów z modów -->
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
import type {PropType} from 'vue';
import {defineComponent, ref, watch} from 'vue';

export default defineComponent({
  components: {},
  props: {
    mod: {
      type: Object as PropType<Mod>,
      required: true,
    },
  },
  setup(props) {
    const clonedMod: Mod = JSON.parse(JSON.stringify(props.mod));
    const desc = ref<string>(loadModDescription(clonedMod));
    const img = ref<string | null>(loadImage(clonedMod));

    watch(
      () => props.mod,
      newMod => {
        const clonedNewMod: Mod = JSON.parse(JSON.stringify(newMod));
        desc.value = loadModDescription(clonedNewMod);
        img.value = loadImage(clonedNewMod);
      },
    );

    return {desc, img};
  },
});
</script>

<style lang="scss">
.details {
  flex: 0 0 60%;
}
</style>
