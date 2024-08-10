<template>
  <div class="flex h-182 flex-col items-center overflow-y-auto p-2 text-menu">
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
import { defineComponent, ref } from 'vue';
import { getAllIniNames } from '#preload';

export default defineComponent({
  setup() {
    const configFiles = ref<string[]>([]);
    getAllIniNames().then(result => {
      if (!result) return;
      configFiles.value.push(...result);
    });
    const getName = (fullName: string) => {
      return fullName.split('.')[0];
    };

    return { configFiles, getName };
  },
});
</script>
