<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    v-if="!selectedMod"
    class="mb-6 flex w-91 items-center justify-center rounded-lg border border-dashed border-light text-light"
  >
    <div class="flex flex-col justify-center">
      <span class="w-44 text-center">
        {{ $t('main.preview.default') }}
      </span>
      <img
        class="m-auto mt-3 w-6"
        src="../../assets/svg/cursor-default-click.svg"
      />
    </div>
  </div>
  <div
    v-else-if="mod"
    class="w-91"
  >
    <div class="mb-2 flex items-center justify-between border-b border-divider">
      <div>
        <div class="font-bold">{{ mod.title }}</div>
        <div
          v-if="mod.authors.length"
          class="text-xs text-light"
        >
          <span
            v-if="mod.authors.length > 1"
            class="mr-2.5"
          >
            {{ $t('main.preview.authors') }}:
          </span>
          <span
            v-else
            class="mr-2.5"
          >
            {{ $t('main.preview.author') }}:
          </span>
          <span
            v-for="(author, index) in mod.authors"
            :key="index"
            class="after:content-[',_'] last:after:content-['']"
          >
            {{ author }}
          </span>
        </div>
      </div>

      <button-tooltip
        class="mr-2 text-primary"
        icon="mdi-folder-outline"
        @click="openFolder(mod.path)"
      >
        {{ $t('main.preview.openModFolder') }}
      </button-tooltip>
    </div>
    <div class="h-105 overflow-y-auto">
      <img
        class="mb-2.5 w-full"
        :src="imgSource"
      />
      <div
        class="description"
        v-html="description"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { loadModDescription, loadImages, loadMods, openFolder } from '#preload';
import { i18n, translate } from '../../../../plugins/i18n';
import type { Mod } from '../../../../interfaces/Mod';
import { useModsStore } from '../stores/mods-store';
import ButtonTooltip from './ButtonTooltip.vue';

export default defineComponent({
  components: { ButtonTooltip },
  setup() {
    const modsStore = useModsStore();
    const description = shallowRef<string>('');
    const gallery = shallowRef<string[]>();
    const imgSource = ref<string>();
    const currentImageIndex = ref(0);
    let interval = setInterval(changeImage, 2000);
    const mod = shallowRef<Mod>();
    const selectedMod = computed(() => modsStore.selectedMod);

    watch([selectedMod, i18n.global.locale], async ([newMod, _]) => {
      mod.value = (await loadMods()).find(mod => mod.id === newMod);
      if (!mod.value) {
        return;
      }
      const loadedDescription = await loadModDescription(mod.value.path);
      description.value =
        loadedDescription && loadedDescription.length
          ? loadedDescription
          : translate('main.preview.noDescription');
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
      if (!selectedMod.value) return;
      currentImageIndex.value = (currentImageIndex.value + 1) % gallery.value!.length;
      imgSource.value = gallery.value![currentImageIndex.value];
    }

    return {
      imgSource,
      description,
      mod,
      selectedMod,
      openFolder,
    };
  },
});
</script>

<style lang="scss">
.description {
  h1 {
    font-size: 40px;
  }

  h2 {
    font-size: 36px;
  }

  h3 {
    font-size: 32px;
  }

  h4 {
    font-size: 28px;
  }

  h5 {
    font-size: 24px;
  }

  h6 {
    font-size: 20px;
  }

  ol {
    margin: 0;
    padding-left: 16px;
    list-style-type: decimal;
    li::marker {
      color: #c7f148;
    }
  }

  ul {
    margin: 0;

    li {
      &:before {
        color: #c7f148;
        content: '\F0374'; // minus
        font-family: 'Material Design Icons';
        margin-right: 2px;
      }

      ul {
        padding-left: 15px;
        li {
          &:before {
            content: '\F0415'; // plus
          }
          ul {
            li {
              &:before {
                content: '\F0374'; // minus
              }
            }
          }
        }
      }
    }
  }
}
</style>
