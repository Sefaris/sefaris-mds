<template>
  <div class="min-h-0 w-full flex-1 overflow-y-auto text-center">
    <div class="text-2xl select-none"> [{{ sectionName }}] </div>
    <ini-configuration-section
      v-for="(section, index) in sections"
      :key="index"
      :section="section"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { loadIniConfiguration } from '#preload';
import type { ConfigSection } from '@interfaces/ConfigSection';
import IniConfigurationSection from './IniConfigurationSection.vue';
export default defineComponent({
  components: { IniConfigurationSection },
  props: {
    configName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const sections = ref<ConfigSection[]>([]);
    const sectionName = ref(props.configName.split('.')[0]);

    onMounted(async () => {
      const ini = await loadIniConfiguration(props.configName);
      if (!ini) return;
      sections.value = ini;
    });

    return {
      sections,
      sectionName,
    };
  },
});
</script>
