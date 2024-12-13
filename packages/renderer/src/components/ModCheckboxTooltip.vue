<template>
  <div ref="referenceElement">
    <img
      v-if="selectedMods.includes($props.modId)"
      class="cursor-pointer select-none rounded bg-primary"
      :class="{ 'cursor-default bg-primary-disabled': isDependencyOfSelectedMod($props.modId) }"
      src="../../assets/svg/check-bold.svg"
      alt="selected"
      @click="deselectMod($props.modId)"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
    />
    <img
      v-else
      class="cursor-pointer select-none rounded"
      :class="{ 'cursor-default bg-disabled': isIncompatibleOfSelectedMod($props.modId) }"
      src="../../assets/svg/state=inactive.svg"
      alt="disabled"
      @click="selectMod($props.modId)"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
    />
    <div
      v-if="visible"
      ref="floatingElement"
      :style="tooltipStyles"
      class="z-20 -mt-1 ml-2 flex w-max flex-col rounded-2xl border-2 border-solid border-divider bg-primary-bg p-2 text-white"
    >
      <div v-if="dependants.length">{{ $t('tooltip.dependencyOf') }}:</div>
      <div
        v-for="(item, index) in dependants"
        :key="index"
        class="text-green-400"
      >
        {{ item }}
      </div>
      <div v-if="incompatibles.length">{{ $t('tooltip.incompatibleWith') }}:</div>
      <div
        v-for="(item, index) in incompatibles"
        :key="index"
        class="text-red-400"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { autoUpdate, flip, shift, useFloating } from '@floating-ui/vue';
import { computed, defineComponent, type PropType, ref } from 'vue';
import type { AppConfiguration } from '@interfaces/AppConfiguration';
import { useModsStore } from '/@/stores/mods-store';
import { NotFoundError } from '../../../../Errors/NotFoundError';
import { getMessage } from '../../../../utils/messages';
import { loggerError, showAlert } from '#preload';
import { translate } from '../../../../plugins/i18n';

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
    const referenceElement = ref<HTMLElement | null>(null);
    const floatingElement = ref<HTMLElement | null>(null);
    const visible = ref(false);

    const { x, y, strategy } = useFloating(referenceElement, floatingElement, {
      strategy: 'fixed',
      placement: 'top',
      whileElementsMounted: autoUpdate,
      middleware: [shift(), flip()],
    });

    function showTooltip() {
      showDependant();
      showIncompatibles();
      if (dependants.value.length || incompatibles.value.length) visible.value = true;
    }

    function hideTooltip() {
      visible.value = false;
    }

    const tooltipStyles = computed(() => ({
      position: strategy.value,
      top: `${y.value ?? 0}px`,
      left: `${x.value ?? 0}px`,
    }));

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

    const incompatibles = ref<Array<string>>([]);
    const dependants = ref<Array<string>>([]);

    function selectDependencies(modId: string) {
      if (props.config?.ignoreDependencies) return;
      const mod = mods.value.find(mod => mod.id === modId);
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
        if (isIncompatibleOfSelectedMod(dependencyMod.id)) {
          showAlert(
            'modal.warning',
            `${translate('alert.resolveIncompatibility')}\n${dependencyMod.id}\n${translate('alert.with')}:\n${getIncompatibles(dependencyMod.id).join('\n')}`,
            'warning',
          );
          throw new Error('a');
        }
        selectMod(dependencyMod.id);
      }
    }

    function selectMod(modId: string) {
      const copyOfSelectedMods = JSON.parse(JSON.stringify(selectedMods.value));
      try {
        if (isIncompatibleOfSelectedMod(modId)) {
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
          selectedMods.value = copyOfSelectedMods;
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

    function isIncompatibleOfSelectedMod(modId: string): boolean {
      if (props.config?.ignoreIncompatible) return false;

      const isModIncompatible = selectedMods.value.some(selectedModId => {
        const mod = mods.value.find(mod => mod.id === selectedModId);
        return mod?.incompatibles?.includes(modId) ?? false;
      });

      const areSelectedModsIncompatible = (() => {
        const currentMod = mods.value.find(mod => mod.id === modId);
        if (!currentMod?.incompatibles) return false;
        return selectedMods.value.some(selectedModId =>
          currentMod.incompatibles.includes(selectedModId),
        );
      })();

      return isModIncompatible || areSelectedModsIncompatible;
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

    function showIncompatibles() {
      incompatibles.value = [];
      if (props.config?.ignoreIncompatible) return;
      const selectedModsFull = mods.value.filter(mod => selectedMods.value.includes(mod.id));
      const incompatiblesFromSelected = selectedModsFull.filter(mod =>
        mod.incompatibles.includes(props.modId),
      );

      const currentMod = mods.value.find(mod => mod.id === props.modId);
      if (!currentMod) return;
      if (selectedMods.value.find(items => items.includes(currentMod.id))) return; // Don't show incompatible for already selected mod.

      const incompatiblesWithCurrentMod = currentMod?.incompatibles
        ? selectedModsFull.filter(mod => currentMod.incompatibles.includes(mod.id))
        : [];
      const allIncompatibles = Array.from(
        new Set([...incompatiblesFromSelected, ...incompatiblesWithCurrentMod]),
      );

      incompatibles.value = allIncompatibles.map(mod => mod.id);
    }

    function getIncompatibles(id: string) {
      if (props.config?.ignoreIncompatible) return [];
      const selectedModsFull = mods.value.filter(mod => selectedMods.value.includes(mod.id));
      const incompatiblesFromSelected = selectedModsFull.filter(mod =>
        mod.incompatibles.includes(id),
      );
      const currentMod = mods.value.find(mod => mod.id === id);
      const incompatiblesWithCurrentMod = currentMod?.incompatibles
        ? selectedModsFull.filter(mod => currentMod.incompatibles.includes(mod.id))
        : [];
      const allIncompatibles = Array.from(
        new Set([...incompatiblesFromSelected, ...incompatiblesWithCurrentMod]),
      );

      return allIncompatibles.map(mod => mod.id);
    }

    function showDependant() {
      dependants.value = [];

      if (props.config?.ignoreDependencies) return;
      const selectedModsFull = mods.value.filter(mod => selectedMods.value.includes(mod.id));
      const dependantsId = selectedModsFull.filter(mod => mod.dependencies?.includes(props.modId));

      dependants.value = dependantsId.map(mod => mod.id);
    }

    return {
      showTooltip,
      hideTooltip,
      tooltipStyles,
      visible,
      referenceElement,
      floatingElement,
      selectedMods,
      selectMod,
      deselectMod,
      isDependencyOfSelectedMod,
      isIncompatibleOfSelectedMod,
      showIncompatibles,
      showDependant,
      incompatibles,
      dependants,
    };
  },
});
</script>
