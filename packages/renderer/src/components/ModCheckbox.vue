<template>
  <img
    v-if="selectedMods.includes($props.modId)"
    class="cursor-pointer rounded bg-primary"
    :class="{ 'cursor-default bg-primary-disabled': isDependencyOfSelectedMod($props.modId) }"
    src="../../assets/svg/check-bold.svg"
    @click="deselectMod($props.modId)"
  />
  <img
    v-else
    class="cursor-pointer rounded"
    :class="{ 'cursor-default bg-disabled': isIncompatibleofSelectedMod($props.modId) }"
    src="../../assets/svg/state=unactive.svg"
    @click="selectMod($props.modId)"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useModsStore } from '../stores/mods-store';
export default defineComponent({
  props: {
    modId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const modsStore = useModsStore();
    const mods = computed(() => modsStore.mods);
    const selectedMods = computed({
      get() {
        return modsStore.selectedMods;
      },
      set(mods) {
        modsStore.setSelectedMods(mods);
      },
    });

    function selectDependencies(modId: string) {
      const mod = mods.value.find(mod => mod.id === modId);
      if (!mod) {
        throw new Error(`Mod ${modId} not found`);
      }
      for (const dependency of mod.dependencies) {
        const dependencyMod = mods.value.find(mod => mod.id === dependency);
        if (!dependencyMod) {
          throw new Error(`Dependency ${dependency} not found`);
        }
        selectMod(dependencyMod.id);
      }
    }

    function selectMod(modId: string) {
      if (isIncompatibleofSelectedMod(modId)) {
        return;
      }
      if (!selectedMods.value.includes(modId)) {
        selectedMods.value.push(modId);
      }
      const mod = mods.value.find(mod => mod.id === modId);
      modsStore.deactivatePreset();
      if (!mod?.dependencies.length) {
        return;
      }
      selectDependencies(modId);
    }

    function isDependencyOfSelectedMod(modId: string): boolean {
      return selectedMods.value.some(selectedModId => {
        const mod = mods.value.find(mod => mod.id === selectedModId);
        return mod?.dependencies?.includes(modId) ?? false;
      });
    }

    function isIncompatibleofSelectedMod(modId: string): boolean {
      return selectedMods.value.some(selectedModId => {
        const mod = mods.value.find(mod => mod.id === selectedModId);
        return mod?.incompatibles?.includes(modId) ?? false;
      });
    }

    function deselectMod(modId: string) {
      if (!selectedMods.value.includes(modId)) {
        return;
      }
      if (isDependencyOfSelectedMod(modId)) {
        return;
      }
      modsStore.deactivatePreset();
      selectedMods.value.splice(selectedMods.value.indexOf(modId), 1);
    }

    return {
      selectedMods,
      selectMod,
      deselectMod,
      isDependencyOfSelectedMod,
      isIncompatibleofSelectedMod,
    };
  },
});
</script>
