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
import { defineComponent, onMounted, ref } from 'vue';
import { getAllIniNames } from '#preload';

export default defineComponent({
  setup() {
    const configFiles = ref<string[]>([]);

    const getName = (fullName: string) => {
      return fullName.split('.')[0];
    };

    onMounted(async () => {
      configFiles.value = await getAllIniNames();
    });

    return { configFiles, getName };
  },
});
</script>
