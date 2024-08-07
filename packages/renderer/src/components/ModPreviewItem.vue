<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    v-if="mod"
    class="w-91"
  >
    <div class="font-bold">{{ mod.title }}</div>
    <div
      v-if="mod.authors.length"
      class="text-xs text-light mb-2 border-b border-divider"
    >
      <span class="mr-2.5">{{ $t('main.preview.author') }}:</span>
      <span
        v-for="(author, index) in mod.authors"
        :key="index"
      >
        {{ author }}
      </span>
    </div>
    <div class="overflow-y-auto h-105">
      <img
        class="w-87 mb-2.5"
        :src="imgSource"
      />
      <div v-html="description"></div>
      <div v-html="description"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { loadModDescription, loadImages, loadMods } from '#preload';
import { i18n, translate } from '../../../../plugins/i18n';
import type { Mod } from '@interfaces/Mod';

export default defineComponent({
  props: {
    selectedMod: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const description = shallowRef<string>('No descrioption available.');
    const gallery = shallowRef<string[]>();
    const imgSource = ref<string>();
    const currentImageIndex = ref(0);
    let interval = setInterval(changeImage, 2000);
    const mod = shallowRef<Mod>();

    watch([() => i18n.global.locale.value, () => props.selectedMod], async ([_, newMod]) => {
      mod.value = (await loadMods()).find(mod => mod.id === newMod);
      if (!mod.value) return;
      description.value =
        (await loadModDescription(mod.value.path)) ?? translate('main.preview.noDescription');
      gallery.value = loadImages(mod.value.path);
      imgSource.value = gallery.value[0];
      currentImageIndex.value = 0;

      if (interval !== null) {
        clearInterval(interval);
      }
      if (gallery.value.length > 1) {
        interval = setInterval(changeImage, 2000);
      }
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
