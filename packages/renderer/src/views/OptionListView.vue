<template>
  <div class="flex h-182 flex-col items-center gap-2 overflow-y-auto p-2 text-menu">
    <h1 class="text-2xl">
      {{ $t('nav.top.options') }}
    </h1>
    <router-link
      v-if="validGothicIniFile"
      :to="{ name: 'Option', params: { ini: 'ge3.ini' } }"
      class="text-xl hover:text-menu-hover"
    >
      Gothic
    </router-link>
    <router-link
      :to="{ name: 'StarterOptions' }"
      class="text-xl hover:text-menu-hover"
    >
      Starter
    </router-link>
    <router-link
      v-for="(name, index) in configFiles"
      :key="index"
      :to="{ name: 'Option', params: { ini: name } }"
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
