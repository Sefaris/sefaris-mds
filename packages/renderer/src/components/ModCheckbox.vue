<template>
  <img
    v-if="selectedMods.includes($props.modId)"
    class="cursor-pointer select-none rounded bg-primary"
    :class="{ 'cursor-default bg-primary-disabled': isDependencyOfSelectedMod($props.modId) }"
    src="../../assets/svg/check-bold.svg"
    @click="deselectMod($props.modId)"
  />
  <img
    v-else
    class="cursor-pointer select-none rounded"
    :class="{ 'cursor-default bg-disabled': isIncompatibleofSelectedMod($props.modId) }"
    src="../../assets/svg/state=inactive.svg"
    @click="selectMod($props.modId)"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import { useModsStore } from '../stores/mods-store';
import { loggerWarn, showAlert, loggerError } from '#preload';
import { getMessage } from '../../../../utils/messages';
import { translate } from '../../../../plugins/i18n';
import type { AppConfiguration } from '@interfaces/AppConfiguration';
import { NotFoundError } from '../../../../Errors/NotFoundError';
export default defineComponent({
  props: {
    modId: {
      type: String,
      required: true,
    },
    config: {
      type: Object as PropType<AppConfiguration | null>,
      required: true,
    },
  },
  setup(props) {
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
      if (props.config?.ignoreDependencies) return;
      const mod = mods.value.find(mod => mod.id === modId);
      try {
        if (!mod) {
          throw new NotFoundError(getMessage('MOD_NOT_FOUND', { name: modId }));
        }
        for (const dependency of mod.dependencies) {
          const dependencyMod = mods.value.find(mod => mod.id === dependency);
          if (!dependencyMod) {
            showAlert(
              'modal.error',
              `${translate('alert.dependencyNotFound')} ${dependency}`,
              'error',
            );
            throw new NotFoundError(getMessage('DEPENDENCY_NOT_FOUND', { name: dependency }));
          }
          selectMod(dependencyMod.id);
        }
      } catch (error) {
        if (error instanceof Error) {
          loggerWarn(error.message);
        }
      }
    }

    function selectMod(modId: string) {
      try {
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
      } catch (error) {
        if (error instanceof Error) {
          loggerError(error.message);
        }
      }
    }

    function isDependencyOfSelectedMod(modId: string): boolean {
      if (props.config?.ignoreDependencies) return false;
      return selectedMods.value.some(selectedModId => {
        const mod = mods.value.find(mod => mod.id === selectedModId);
        return mod?.dependencies?.includes(modId) ?? false;
      });
    }

    function isIncompatibleofSelectedMod(modId: string): boolean {
      if (props.config?.ignoreIncompatible) return false;
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
