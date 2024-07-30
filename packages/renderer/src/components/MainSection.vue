<template>
  <div class="main">
    <div class="main-mods">
      <div
        v-for="(mod, index) in mods"
        :key="index"
        class="main-mods-mod"
      >
        <div class="main-mods-mod-checkbox">
          <img
            v-if="selectedMods.includes(mod.id)"
            class="main-mods-mod-checkbox-active"
            :class="{ 'main-mods-mod-checkbox-dependency': isDependencyOfSelectedMod(mod.id) }"
            src="../../assets/svg/check-bold.svg"
            @click="deselectMod(mod.id)"
          />
          <img
            v-else
            class="main-mods-mod-checkbox-inactive"
            :class="{ 'main-mods-mod-checkbox-incompatible': isIncompatibleofSelectedMod(mod.id) }"
            src="../../assets/svg/state=unactive.svg"
            @click="selectMod(mod.id)"
          />
        </div>
        <div
          class="main-mods-mod-name"
          :class="{ 'main-mods-mod-name-active': selectedMod === mod.id }"
          @click="selectedMod = mod.id"
        >
          {{ mod.id }}
        </div>
      </div>
    </div>
    <mod-preview :selected-mod="selectedMod" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import ModPreview from './ModPreview.vue';
import { useModsStore } from '../stores/mods-store';
export default defineComponent({
  components: { ModPreview },
  setup() {
    const modsStore = useModsStore();
    const mods = computed(() => modsStore.displayedMods);
    const selectedMods = computed({
      get() {
        return modsStore.selectedMods;
      },
      set(mods) {
        modsStore.setSelectedMods(mods);
      },
    });

    const installedMods = ref<string[]>([]);
    const selectedMod = ref<string>();

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
      if (!mod?.dependencies.length) {
        return;
      }

      selectDependencies(modId);
    }

    function isDependencyOfSelectedMod(modId: string): boolean {
      return selectedMods.value.some(selectedModId => {
        const mod = mods.value.find(mod => mod.id === selectedModId);
        return mod?.dependencies.includes(modId) ?? false;
      });
    }

    function isIncompatibleofSelectedMod(modId: string): boolean {
      return selectedMods.value.some(selectedModId => {
        const mod = mods.value.find(mod => mod.id === selectedModId);
        return mod?.incompatibles.includes(modId) ?? false;
      });
    }
    function deselectMod(modId: string) {
      if (!selectedMods.value.includes(modId)) {
        return;
      }
      if (isDependencyOfSelectedMod(modId)) {
        return;
      }

      selectedMods.value.splice(selectedMods.value.indexOf(modId), 1);
    }

    function checkDetails(modId: string) {
      selectedMod.value = modId;
    }

    return {
      mods,
      selectedMods,
      installedMods,
      selectedMod,
      selectMod,
      deselectMod,
      isDependencyOfSelectedMod,
      isIncompatibleofSelectedMod,
      checkDetails,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';
@import '../../assets/styles/mixins.scss';

.main {
  display: flex;
  justify-content: space-evenly;
  height: $main-height;
  padding-top: $padding-big;

  &-mods {
    width: $main-sections-width;
    overflow-y: auto;

    &-mod {
      @include center-vertically;

      &-checkbox {
        cursor: pointer;

        &-dependency {
          background-color: rgba($primary-color, 0.5) !important;
        }

        &-incompatible {
          border-radius: $border-radius-small;
          background-color: $color-incompatible !important;
          cursor: default;
        }

        &-active {
          background-color: $primary-color;
          border-radius: $border-radius-small;
        }
      }

      &-name {
        @include center-vertically;
        height: 36px;
        cursor: pointer;
        margin-left: $margin-regular;
        margin-right: $margin-between;
        width: 100%;

        &-active {
          border-right: 4px solid $primary-color;
        }
      }
    }
  }

  &-preview {
    width: $main-sections-width;
    border-radius: $border-radius-medium;
    margin-bottom: $padding-big;
    height: 506px;

    &-default {
      @include center;
      border: 1px dashed $text-light;
      height: 458px !important;
      overflow-y: none;
      &-content {
        width: 170px;
        color: $text-light;
        text-align: center;

        &-message {
          margin-bottom: $margin-regular;
        }
      }
    }

    &-author {
      font-size: $font-size-small;
      color: $text-light;
      margin-top: $margin-minimal;

      &-name {
        &:first-child {
          margin-left: $margin-small;
        }

        &::after {
          content: ', ';
        }

        &:last-child::after {
          content: '';
        }
      }
    }

    &-content {
      &-description {
        height: 434px;
        margin-top: $margin-regular;
        overflow-y: auto;

        &-image {
          margin-bottom: $margin-small;
          max-width: 348px;
        }
      }
    }
  }
}
</style>
