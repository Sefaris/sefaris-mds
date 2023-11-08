<template>
  <div class="preset-container">
    <input
      v-model="presetName"
      placeholder="Preset name..."
      class="preset-input"
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

    <custom-button
      :action="save"
      icon="mdi-content-save"
      :disabled="!presetName"
    />
    <custom-button
      :action="load"
      icon="mdi-upload"
      :disabled="!presetName"
    />
    <custom-button
      :action="remove"
      icon="mdi-delete"
      :disabled="!presetName"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getPresetNames, loadPreset, savePreset, deletePreset } from '#preload';
import type { Mod } from '#preload';

import CustomButton from './CustomButton.vue';
export default defineComponent({
  components: { CustomButton },
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
      const preset = await loadPreset(presetName.value);
      emit('loadPreset', preset);
    }

    function getModsIds() {
      return props.modIds.map(mod => mod.id);
    }





    return { presetName, presetNames, getModsIds, getPresetNames, load, save, remove, reloadPresets };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.preset-container {
  display: flex;
  justify-content: end;
  gap: 0.25rem;
  margin-left: 0.5rem;

}

.preset-input {

  background-color: $primary-color;
  border: 1px solid $accent;
  border-radius: 0.25rem;
  color: $text-color;
  margin: 0.25rem 0;
  padding: 0 0.5rem;
  width: 100%;

  &::-webkit-calendar-picker-indicator {
    display: none;
    content: '▼';
    color: $accent;
  }
}
</style>
