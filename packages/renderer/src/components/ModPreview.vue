<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    v-if="!selectedMod"
    class="main-preview main-preview-default"
  >
    <div class="main-preview-default-content">
      <div class="main-preview-default-content-message">
        {{ $t('main.preview.default') }}
      </div>
      <img
        class="main-preview-default-content-icon"
        src="../../assets/svg/cursor-default-click.svg"
      />
    </div>
  </div>
  <div
    v-else-if="mod"
    class="main-preview"
  >
    <div class="main-preview-name">{{ mod.title }}</div>
    <div
      v-if="mod.authors.length"
      class="main-preview-author"
    >
      {{ $t('main.preview.author') }}:
      <span
        v-for="(author, index) in mod.authors"
        :key="index"
        class="main-preview-author-name"
      >{{ author }}</span>
    </div>
    <div class="main-preview-content">
      <div class="main-preview-content-description">
        <img
          class="main-preview-content-description-image"
          :src="imgSource"
        />
        <div v-html="description"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import type { Mod } from '#preload';
import { loadModDescription, loadImages, loadMods } from '#preload';
import { i18n } from '../plugins/i18n';

export default defineComponent({
  props: {
    selectedMod: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const description = shallowRef<string>('No descrioption available.');
    const gallery = shallowRef<string[]>();
    const imgSource = ref<string>();
    const currentImageIndex = ref(0);
    let interval = setInterval(changeImage, 2000);
    const mod = shallowRef<Mod>();

    watch([() => props.selectedMod, () => i18n.global.locale.value], async ([newMod, _]) => {
      mod.value = (await loadMods()).find(mod => mod.id === newMod);
      if (!mod.value) {
        console.error(`Mod ${newMod} doesn't exist!`);
        return;
      }

      gallery.value = loadImages(mod.value.path);
      imgSource.value = gallery.value[0];
      currentImageIndex.value = 0;

      description.value = await loadModDescription(mod.value.path);
      if (interval !== null) {
        clearInterval(interval);
      }
      if (gallery.value.length > 1) {
        interval = setInterval(changeImage, 2000);
      }
      description.value = await loadModDescription(mod.value.path);
    });

    onBeforeUnmount(() => {
      if (interval !== null) {
        clearInterval(interval);
      }
    });

    function changeImage() {
      if (!props.selectedMod) return;
      currentImageIndex.value = (currentImageIndex.value + 1) % gallery.value!.length;
      imgSource.value = gallery.value![currentImageIndex.value];
    }

    return {
      imgSource,
      description,
      mod,
    };
  },
});
</script>
