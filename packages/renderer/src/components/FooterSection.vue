<template>
  <footer class="footer">
    <div
      v-if="!installation"
      class="footer-controls"
    >
      <div class="footer-controls-image">
        <img src="../../assets/images/game-icon.png" />
      </div>
      <div
        v-if="!ready"
        class="footer-controls-buttons"
      >
        <button
          class="footer-controls-buttons-cancel"
          @click="cancelChanges()"
        >
          {{ $t('action.cancel') }}
        </button>
        <button
          class="footer-controls-buttons-install"
          @click="startInstallation()"
        >
          {{ $t('action.install') }}
        </button>
      </div>
      <div
        v-else
        class="footer-controls-buttons"
      >
        <button
          class="footer-controls-buttons-play"
          @click="play()"
        >
          {{ $t('action.play') }}
        </button>
      </div>
    </div>

    <div
      v-else
      class="footer-progress"
    >
      <div class="footer-progress-bar">
        <div
          :style="{ width: progressStyle }"
          class="footer-progress-bar-value"
        ></div>
      </div>
      <div class="footer-progress-info">
        <div class="footer-progress-info-state">
          <div class="footer-progress-info-state-integration">Trwa integracja modów.</div>
          <div class="footer-progress-info-state-warning">Nie wyłączaj launchera!</div>
        </div>
        <div class="footer-progress-info-value">{{ progress }}%</div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useModsStore } from '../stores/mods-store';
import { installMods, startGame } from '#preload';
import type { ProgressStatus } from '@interfaces/progress-status';
import { i18n } from '../plugins/i18n';
export default defineComponent({
  components: {},
  setup() {
    const modsStore = useModsStore();
    const progress = ref(0);
    const progressStyle = ref('0%');
    const installation = ref(false);
    const ready = computed(() =>
      compareArrays(
        modsStore.selectedMods.map(mod => mod),
        modsStore.installedMods.map(mod => mod.id),
      ),
    );
    const activePreset = computed(() => modsStore.activePreset);
    const selectedMods = computed({
      get() {
        return modsStore.selectedMods;
      },
      set(mods) {
        modsStore.setSelectedMods(mods);
      },
    });
    const installedMods = computed({
      get() {
        return modsStore.installedMods;
      },
      set(mods) {
        modsStore.setInstalledMods(mods);
      },
    });
    const edit = ref(true);

    const startInstallation = async () => {
      installation.value = true;
      installMods(JSON.parse(JSON.stringify(selectedMods.value)), activePreset.value)
        .then(time => {
          alert(`${i18n.global.t('alert.installed')} ${time}s`);
          installedMods.value = modsStore.mods.filter(mod => selectedMods.value.includes(mod.id));
          installation.value = false;
        })
        .catch(err => {
          installation.value = false;
          console.error(err);
        });
    };
    const cancelChanges = () => {
      selectedMods.value = modsStore.installedMods.map(mod => mod.id);
    };
    const play = async () => {
      //TODO: START GAME
      await startGame();
    };

    window.addEventListener('message', event => {
      const data = event.data as ProgressStatus;
      progress.value = Number(((data.step / data.maxSteps) * 100).toFixed(1));
      progressStyle.value = `${progress.value}%`;
    });

    function compareArrays(arr1: string[], arr2: string[]): boolean {
      if (arr1.length !== arr2.length) {
        return false;
      }

      // Sort both arrays
      const sortedArr1 = [...arr1].sort();
      const sortedArr2 = [...arr2].sort();
      // Compare sorted arrays
      for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
          return false;
        }
      }

      return true;
    }

    return {
      progress,
      ready,
      progressStyle,
      edit,
      installation,
      startInstallation,
      cancelChanges,
      play,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.footer {
  display: flex;

  outline: 1px solid $divider-color;
  height: $footer-height;

  &-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &-image {
      padding-left: $padding-big;
    }

    &-buttons {
      display: flex;
      padding: $padding-big;
      gap: 12px;

      &-install {
        color: $text-white;
        font-size: $font-size-huge;
        width: 315px;
        height: 60px;
        background: none;
        border: none;
        font-family: $font-gothic;
        background-image: url('../../assets/images/integrate.png');
      }

      &-play {
        color: $text-white;
        font-size: $font-size-huge;
        width: 315px;
        height: 60px;
        background: none;
        border: none;
        background-image: url('../../assets/images/play.png');
        font-family: $font-gothic;
      }

      &-cancel {
        background: none;
        border: none;
        color: $text-white;
        font-size: $font-size-regular;
        padding-right: $padding-small;
      }
    }
  }

  &-progress {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;

    &-bar {
      width: 100%;
      height: $progress-bar-height;

      &-value {
        height: $progress-bar-height;
        width: 250px;
        background-color: $accent;
      }
    }

    &-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100px;
      width: 100%;
      padding: $padding-big;

      &-state {
        &-warning {
          margin-top: $margin-minimal;
          color: $text-light;
        }
      }

      &-value {
        color: $accent;
        font-size: $font-size-enourmous;
      }
    }
  }
}
</style>
