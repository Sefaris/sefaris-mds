<template>
  <div class="container">
    <router-link to="/configuration">Configuration</router-link>
    <div>
      <button @click="installModifications">Install</button>
      <button @click="deleteModifications">Delete</button>
      <button @click="selectAll">SELECT ALL</button>
    </div>

    <div class="mods">
      <mod-details
        v-if="modInfo"
        :mod="modInfo"
      />

      <div class="mods-list">
        <mod-item
          v-for="(mod, index) in modList"
          :key="index"
          :mod="mod"
          :checked="selectedMods.includes(mod)"
          @mod-details="handleModInfo(mod)"
          @change="onModChange(mod, $event)"
        />
      </div>
    </div>
    <progress-bar
      :action-name="actionName"
      :progress="progress"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, shallowRef} from 'vue';

import type {Mod} from '#preload';
import {loadMods, loadInstalledMods, installMods, deleteMods} from '#preload';

import ModItem from '../components/ModItem.vue';
import ModDetails from '../components/ModDetails.vue';
import ProgressBar from '../components/ProgressBar.vue';

export default defineComponent({
  components: {ModDetails, ModItem, ProgressBar},

  setup() {
    const modInfo = shallowRef<Mod>();
    const modList = shallowRef<Mod[]>([]);
    const selectedMods = ref<Mod[]>([]);
    const actionName = ref<string>('Waiting for action...');
    const progress = ref<number>(0);

    //TODO: Nasłuchiwanie na zdarzenia z funkcji preload
    //Do poprawienia, bo nie działa w większości wypadków
    window.addEventListener('message', event => {
      const message = event.data;
      actionName.value = message.actionName;
      progress.value = message.progressValue;
    });
    loadMods().then(mods => {
      modList.value = mods;
      if (mods.length === 0) {
        return;
      }
      modInfo.value = mods[0];
    });

    loadInstalledMods().then(mods => (selectedMods.value = mods));

    function selectDependencies(mod: Mod) {
      for (const dependency of mod.dependencies) {
        const dependencyMod = modList.value.find(mod => mod.id === dependency);
        if (!dependencyMod) {
          throw new Error(`Dependency ${dependency} not found`);
        }

        selectMod(dependencyMod);
      }
    }

    function selectMod(mod: Mod) {
      if (!selectedMods.value.includes(mod)) {
        selectedMods.value.push(mod);
      }

      if (mod.dependencies.length == 0) {
        return;
      }

      selectDependencies(mod);
    }

    function deselectMod(mod: Mod) {
      if (!selectedMods.value.includes(mod)) {
        return;
      }

      selectedMods.value.splice(selectedMods.value.indexOf(mod), 1);
    }

    function onModChange(mod: Mod, value: boolean) {
      if (value) {
        selectMod(mod);
        return;
      }

      deselectMod(mod);
    }

    async function selectAll() {
      selectedMods.value = modList.value;
    }

    async function installModifications() {
      const ids = selectedMods.value.map(mod => mod.id);
      const time = await installMods(ids);
      //TODO: Replace with toast
      alert(`Installed ${selectedMods.value.length} mods in ${time}ms`);
    }

    function handleModInfo(mod: Mod) {
      modInfo.value = mod;
    }

    function deleteModifications() {
      deleteMods();
      //TODO: Replace with toast
      alert('Deleted all modifications');
    }

    return {
      modList,
      modInfo,
      selectedMods,
      actionName,
      progress,
      handleModInfo,
      onModChange,
      installModifications,
      deleteModifications,
      selectAll,
    };
  },
});
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
}
.mods {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  &-list {
    display: flex;
    flex-direction: column;
    flex-basis: 40%;
    gap: 0.5rem;
    overflow-y: auto;
    max-height: 700px;
  }
}
</style>
