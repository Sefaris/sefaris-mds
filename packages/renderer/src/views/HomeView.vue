<template>
  <RouterLink to="/configuration">Configuration</RouterLink>
  <div class="container">
    <ModDetails
      v-if="modsReady && selectedMod"
      :mod-item="selectedMod"
    />
    <ModList
      v-if="modsReady"
      :mod-list="modList"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import type {Mod} from '#preload';
import {loadMods} from '#preload';
import ModList from '../components/ModList.vue';
import ModDetails from '../components/ModDetails.vue';
export default defineComponent({
  components: {ModList, ModDetails},
  setup() {
    const modsReady = ref<boolean>(false);
    const selectedMod = ref<Mod>();
    const modList: Mod[] = [];

    loadMods().then(mods => {
      //TODO: opis moda jest zrobiony na sztywno, trzeba to zmienić
      selectedMod.value = mods[0];
      modList.push(...mods);
      console.log(modList);
      modsReady.value = true;
    });

    return {modList, modsReady, selectedMod};
  },
});
</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}
</style>
