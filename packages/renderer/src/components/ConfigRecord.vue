<template>
  <div class="h-174.5 w-full overflow-y-auto text-center">
    <div class="text-2xl">[{{ sectionName }}]</div>
    <config-options
      v-for="(section, index) in sections"
      :key="index"
      :section="section"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { loadIniConfiguration } from '#preload';
import type { ConfigSection } from '@interfaces/ConfigSection';
import ConfigOptions from './ConfigOptions.vue';
export default defineComponent({
  components: { ConfigOptions },
  props: {
    configName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const sections = ref<ConfigSection[]>([]);
    const sectionName = ref(props.configName.split('.')[0]);
    loadIniConfiguration(props.configName).then(result => {
      if (!result) return;
      sections.value = result;
      console.log(sections.value);
    });
    return {
      sections,
      sectionName,
    };
  },
});
</script>
