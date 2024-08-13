<template>
  <div class="h-174.5 w-full overflow-y-auto text-center">
    <div class="select-none text-2xl">[{{ sectionName }}]</div>
    <ini-configuration-section
      v-for="(section, index) in sections"
      :key="index"
      :section="section"
      @update-section="handleUpdateSection"
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

    const handleUpdateSection = (section: ConfigSection) => {
      const index = sections.value.findIndex(sec => sec.name === section.name);
      if (index !== -1) {
        sections.value[index] = section;
        console.log(JSON.stringify(sections.value[0].options, null, 4));
      } else {
        console.warn(`Section with name ${section.name} not found.`);
      }
    };

    return {
      sections,
      sectionName,
      handleUpdateSection,
    };
  },
});
</script>
