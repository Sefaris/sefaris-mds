<template>
  <div class="flex h-182 flex-col items-center overflow-y-auto p-2 text-menu">
    <h1 class="text-2xl">
      {{ $t('nav.top.options') }}
    </h1>
    <div
      v-if="!validGothicIniFile && !configFiles.length"
      class="my-20 flex flex-col text-center"
    >
      <img
        src="../../assets/images/error_500.png"
        class="mx-auto w-max"
      />
      <h3 class="mt-2 text-xl">
        {{ $t('config.inisNotFound') }}
      </h3>
    </div>
    <router-link
      v-if="validGothicIniFile"
      :to="{ name: 'Options', params: { ini: 'ge3.ini' } }"
      class="mt-2 text-xl hover:text-menu-hover"
    >
      Gothic
    </router-link>
    <router-link
      v-for="(name, index) in configFiles"
      :key="index"
      :to="{ name: 'Options', params: { ini: name } }"
      class="text-xl hover:text-menu-hover"
    >
      {{ getName(name) }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getAllIniNames, loadIniConfiguration } from '#preload';

export default defineComponent({
  setup() {
    const configFiles = ref<string[]>([]);
    const validGothicIniFile = ref(false);
    const getName = (fullName: string) => {
      return fullName.split('.')[0];
    };

    onMounted(async () => {
      validGothicIniFile.value = (await loadIniConfiguration('ge3.ini')).length > 0;
      configFiles.value = await getAllIniNames();
    });

    return { configFiles, validGothicIniFile, getName };
  },
});
</script>
