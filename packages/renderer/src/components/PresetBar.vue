<template>
  <div class="preset-container">
    <button @click="reloadPresets">o</button>
    <input
      v-model="presetName"
      list="presets"
    />
    <datalist id="presets">
      <option
        v-for="(preset, index) in presetNames"
        :key="index"
      >
        {{ preset }}
      </option>
    </datalist>

    <button
      :disabled="!presetName"
      @click="save"
    >
      Save
    </button>
    <button
      :disabled="!presetName"
      @click="load"
    >
      Load
    </button>
    <button
      :disabled="!presetName"
      @click="remove"
    >
      Delete
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getPresetNames, loadPreset, savePreset, deletePreset } from '#preload';
import type { Mod } from '#preload';
export default defineComponent({
  props: {
    modIds: {
      type: Array<Mod>,
      required: true,
    },
  },
  emits: ['loadPreset'],
  setup(props, { emit }) {
    const presetName = ref<string>('');
    const presetNames = ref<string[]>([]);

    async function reloadPresets() {
      presetNames.value = await getPresetNames();
    }
    reloadPresets();

    async function save() {
      await savePreset(getModsIds(), presetName.value);
      reloadPresets();
    }

    async function remove() {
      await deletePreset(presetName.value);
      presetName.value = '';
      reloadPresets();
    }

    async function load() {
      const mods = await loadPreset(presetName.value);
      //TODO: Obsługa błędu z brakującymi modami
      emit('loadPreset', mods);
    }

    function getModsIds() {
      return props.modIds.map(mod => mod.id);
    }





    return { presetName, presetNames, getModsIds, getPresetNames, load, save, remove, reloadPresets };
  },
});
</script>

<style lang="scss">
.preset-container {}
</style>
