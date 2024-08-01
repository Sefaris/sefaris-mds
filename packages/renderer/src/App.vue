<template>
  <title-bar />
  <nav-bar />
  <main-section />
  <footer-section />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import TitleBar from './components/TitleBar.vue';
import NavBar from './components/NavBar.vue';
import MainSection from './components/MainSection.vue';
import FooterSection from './components/FooterSection.vue';
import { useModsStore } from './stores/mods-store';
import type { AppConfiguration } from '#preload';
import { closeApplication, loadConfiguration, saveConfiguration, selectGameFolder } from '#preload';
export default defineComponent({
  components: { TitleBar, NavBar, MainSection, FooterSection },
  setup() {
    const modsStore = useModsStore();
    onMounted(async () => {
      const config = await loadConfiguration();
      if (!config) {
        alert('Config not found or corrupted. Select Gothic 3 directory.');
        const gamePath = await selectGameFolder();
        if (!gamePath) closeApplication();
        const config: AppConfiguration = {
          gothicPath: gamePath,
          modsPath: gamePath,
          language: 'gb',
          installedMods: [],
          filesCreated: [],
        };
        await saveConfiguration(config);
      }
      await modsStore.reloadMods();
      await modsStore.loadInstalledMods();
      await modsStore.loadCategories();
    });

    return {};
  },
});
</script>

<style lang="scss">
@import '../assets/styles/main.scss';

#app {
  height: 100vh;
  max-width: 100vw;
  background-image: url('./../assets/images/background.png');
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.8);
}
</style>
