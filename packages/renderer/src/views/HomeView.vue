<template>
  <div class="container">
    <div class="tool-bar">
      <div class="installation-bar">
        <custom-button
          :disabled="selectedMods.length === 0"
          :action="installModifications"
          icon="mdi-play"
        />
        <custom-button
          :action="mergeModFiles"
          icon="mdi-set-merge"
        />
        <custom-button
          :action="deleteModifications"
          icon="mdi-delete"
        />
        <custom-button
          :action="selectAll"
          icon="mdi-select-group"
        />
        <custom-button
          :action="openGameFolder"
          icon="mdi-gamepad-variant"
        />
        <custom-button
          :action="openModsFolder"
          icon="mdi-folder"
        />
      </div>
      <preset-bar
        :mod-ids="selectedMods"
        @load-preset="handleLoadPreset"
      />
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
import { defineComponent, ref, shallowRef } from 'vue';

import type { Mod, Preset } from '#preload';
import { loadMods, loadInstalledModsIds, installMods, deleteMods, getPresetNames, openGameFolder, openModsFolder, mergeModFiles } from '#preload';

import ModItem from '../components/ModItem.vue';
import ModDetails from '../components/ModDetails.vue';
import ProgressBar from '../components/ProgressBar.vue';
import PresetBar from '../components/PresetBar.vue';
import CustomButton from '../components/CustomButton.vue';

export default defineComponent({
  components: { ModDetails, ModItem, ProgressBar, PresetBar, CustomButton },

  setup() {
    const modInfo = shallowRef<Mod>();
    const modList = shallowRef<Mod[]>([]);
    const selectedMods = ref<Mod[]>([]);
    const actionName = ref<string>('Waiting for action...');
    const progress = ref<number>(0);
    const selectedPreset = ref<string>('');



    loadMods().then(mods => {
      modList.value = mods;
      if (mods.length === 0) {
        return;
      }
      modInfo.value = mods[0];
    });

    loadInstalledModsIds().then(mods => (selectedMods.value = modList.value.filter(mod => mods.includes(mod.id))));

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
      selectedPreset.value = '';
      if (value) {
        selectMod(mod);
        return;
      }

      deselectMod(mod);
    }

    async function selectAll() {
      if (modList.value.length === selectedMods.value.length) {
        selectedMods.value = [];
        return;
      }
      for (const mod of modList.value) {
        selectMod(mod);
      }
    }

    async function installModifications() {
      const ids = selectedMods.value.map(mod => mod.id);
      const time = await installMods(ids, selectedPreset.value);
      //TODO: Replace with toast
      alert(`Installed ${selectedMods.value.length} mods in ${time}s`);
    }

    function handleModInfo(mod: Mod) {
      modInfo.value = mod;
    }

    function deleteModifications() {
      deleteMods();
      //TODO: Replace with toast
      alert('Deleted all modifications');
    }


    function handleLoadPreset(preset: Preset) {
      selectedMods.value = modList.value.filter(mod => preset.modIds.includes(mod.id));
      selectedPreset.value = preset.name;
      const missingMods = preset.modIds.filter((modId: string) => !modList.value.some(mod => mod.id === modId));
      if (missingMods.length > 0) {
        alert(`Preset contains mods which you dont have: ${missingMods.join(', ')}`);
      }
    }





    return {
      modList,
      modInfo,
      selectedMods,
      actionName,
      progress,
      selectedPreset,
      handleModInfo,
      onModChange,
      installModifications,
      deleteModifications,
      selectAll,
      getPresetNames,
      handleLoadPreset,
      openGameFolder,
      openModsFolder,
      mergeModFiles,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.container {
  display: grid;
  grid-template-rows: 1fr calc(100vh - 125px);
  height: calc(100vh - 60px);

  .tool-bar {
    height: 45px;
    display: grid;
    grid-template-columns: 60% 1fr;

    justify-content: space-between;
    align-items: center;

    background-color: $primary-color;

    .installation-bar {
      display: flex;
      align-items: center;
      padding-left: 0.5rem;
      height: 100%;
      margin-right: 0.5rem;

      & :nth-last-child(2) {
        margin-left: auto;
      }
    }


  }

  .mods {
    display: grid;
    grid-template-columns: 60% 1fr;

    &-list {
      padding: 0.5rem 0.75rem;
      margin: 0.5rem;
      overflow-y: auto;
      background-color: $secondary-color;

      border: 0.25rem solid $secondary-color;
      border-radius: 0.25rem;


    }
  }

}
</style>
