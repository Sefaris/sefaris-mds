<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="details">
    <img
      v-if="img"
      class="image"
      :src="img"
    />
    <div v-html="desc"></div>
  </div>
</template>

<script lang="ts">
import { loadModDescription, loadImages } from '#preload';
import type { Mod } from '#preload';
import type { PropType } from 'vue';
import { onBeforeUnmount } from 'vue';
import { defineComponent, ref, shallowRef, watch } from 'vue';

export default defineComponent({
  components: {},
  props: {
    mod: {
      type: Object as PropType<Mod>,
      required: true,
    },
  },
  setup(props) {
    const desc = shallowRef<string>(loadModDescription(props.mod.path)) || 'no description';
    const gallery = shallowRef<string[]>(loadImages(props.mod.path));
    const img = ref<string>(gallery.value[0]);
    const currentImageIndex = ref(0);
    const interval = ref(setInterval(changeImage, 2000));

    watch(
      () => props.mod,
      newMod => {
        desc.value = loadModDescription(newMod.path);
        gallery.value = loadImages(newMod.path);
        img.value = gallery.value[0];
        currentImageIndex.value = 0;
        if (interval.value !== null) {
          clearInterval(interval.value);
        }
        if (gallery.value.length > 1) {
          interval.value = setInterval(changeImage, 2000);

        }
      },
    );

    onBeforeUnmount(() => {
      if (interval.value !== null) {
        clearInterval(interval.value);
      }
    });


    function changeImage() {
      console.log('changeImage', currentImageIndex.value);
      console.log('gallery size:', gallery.value.length);
      currentImageIndex.value = (currentImageIndex.value + 1) % gallery.value.length;
      img.value = gallery.value[currentImageIndex.value];
    }


    return { desc, img, interval };
  },

});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.details {
  overflow-y: auto;
  padding: 0.75rem;
  margin: 0.5rem;
  border-radius: 0.25rem;
  border: 0.25rem solid $secondary-color;
  background-color: $secondary-color;

  .image {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 4px;
  }

  h1 {
    margin-top: 1rem;
    margin-bottom: 0.25rem;
    text-align: center;
  }

  h4 {
    margin-top: 1rem;
  }

  ul {
    margin: 0.5rem 0 1rem 2rem;
  }


}
</style>
