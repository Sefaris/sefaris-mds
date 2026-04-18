<template>
  <div class="text-menu flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto p-2">
    <h1 class="text-2xl">
      {{ $t('nav.top.options') }}
    </h1>
    <router-link
      v-if="validGothicIniFile"
      :to="{ name: 'Option', params: { ini: 'ge3.ini' } }"
      class="hover:text-menu-hover text-xl"
    >
      Gothic
    </router-link>
    <router-link
      :to="{ name: 'StarterOptions' }"
      class="hover:text-menu-hover text-xl"
    >
      Starter
    </router-link>
    <router-link
      v-for="(name, index) in configFiles"
      :key="index"
      :to="{ name: 'Option', params: { ini: name } }"
      class="hover:text-menu-hover text-xl"
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
