import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useIniStore = defineStore('ini', () => {
  const iniFilePaths = ref<string[]>([]);

  return {
    iniFilePaths,
  };
});
