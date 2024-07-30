<template>
  <nav
    ref="nav"
    class="nav"
  >
    <div class="nav-top">
      <span
        class="nav-top-logo"
        @click="openWebsite('https://www.sefaris.eu/')"
      > Sefaris.eu </span>

      <div class="nav-top-wrapper">
        <change-locale />
        <div class="nav-top-wrapper-links">
          <button
            href="#"
            class="nav-top-wrapper-links-link"
          >
            Cheats
          </button>
          <button
            href="#"
            class="nav-top-wrapper-links-link"
          >
            Narzędzia
          </button>
          <button
            href="#"
            class="nav-top-wrapper-links-link"
          >
            Import/Eksport
          </button>
          <button
            href="#"
            class="nav-top-wrapper-links-link"
          >
            Opcje
          </button>
          <kofi-button />
        </div>
      </div>
    </div>

    <div class="nav-bottom">
      <div class="nav-bottom-links">
        <span class="nav-bottom-links-label"> {{ $t('nav.title') }}: </span>
        <div class="nav-bottom-links-container">
          <div class="nav-bottom-links-container">
            <button
              class="nav-bottom-links-container-tab"
              :class="{ 'nav-bottom-links-container-tab-active': activeTab === 'all' }"
              @click="setActiveTab('all')"
            >
              {{ $t('nav.bottom.all') }} ({{ modsCounter }})
            </button>
            <button
              class="nav-bottom-links-container-tab"
              :class="{
                'nav-bottom-links-container-tab-active': activeTab === 'installed',
                'nav-bottom-links-container-tab-disabled': !installedModsCounter
              }"
              @click="setActiveTab('installed')"
            >
              {{ $t('nav.bottom.installed') }} ({{ installedModsCounter }})
            </button>
            <!-- <button class="nav-bottom-links-container-tab">Pluginy (10)</button> -->
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { openWebsite } from '#preload';
import ChangeLocale from './ChangeLocale.vue';
import KofiButton from './KofiButton.vue';
import { useModsStore } from '../stores/mods-store';
export default defineComponent({
  components: { ChangeLocale, KofiButton },
  setup() {
    const activeTab = ref('all');
    const setActiveTab = (tab: string) => {
      activeTab.value = tab;
      switch (tab) {
        case 'all':
          displayAllMods();
          break;
        case 'installed':
          displayInstalledMods();
          break;
      }
    };
    const modsStore = useModsStore();
    const modsCounter = computed(() => modsStore.mods.length);
    const installedModsCounter = computed(() => modsStore.installedMods.length);

    const displayAllMods = () => modsStore.displayAllMods();
    const displayInstalledMods = () => modsStore.displayInstalledMods();

    return { openWebsite, modsCounter, activeTab, setActiveTab, installedModsCounter };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';
@import '../../assets/styles/mixins.scss';

.nav {
  &-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $padding-big;
    height: 80px;

    &-logo {
      font-size: $font-size-between;
      font-weight: bold;
      color: $primary-color;
      height: 24px;

      &:hover {
        color: darken($primary-color, 20%);
        cursor: pointer;
      }
    }

    &-wrapper {
      display: flex;
      align-items: center;

      &-flag {
        width: 23px !important;
        height: 18px;
      }

      &-links {
        @include center;
        width: 100%;

        &-link {
          @include center;
          padding-left: $padding-small;
          background-color: inherit;
          border: none;
          color: $text-white;
          font-size: $font-size-regular;

          &-image {
            width: 17px;
          }

          &:hover {
            color: darken($accent, 15%);
          }
        }

        .kofi {
          margin-left: $margin-huge;

          &--cta {
            @include center-horizontally;
            background: $accent;
            color: $text-black !important;
            border-radius: $padding-small;
            transition: background 0.2s ease-in-out;
            height: 32px;
            padding: $padding-tiny $padding-small;

            &:hover {
              background: darken($accent, 15%);
            }

            img {
              margin-left: $margin-regular;
              height: 20px;
            }
          }
        }
      }
    }
  }

  &-bottom {
    border-bottom: 1px solid $divider-color;
    @include center;
    height: 34px;

    &-links {
      display: flex;

      &-label {
        @include center-vertically;
        padding-right: $padding-big;
        color: $text-secondary;
      }

      &-container {
        &-tab {
          height: 34px;
          padding: $margin-between $margin-regular;
          border: none;
          background-color: inherit;
          color: $text-white;
          font-family: $font-lato;
          font-size: $font-size-regular;

          &-active {
            border-bottom: 2px solid $primary-color;
          }

          &-disabled {
            color: $text-light;
          }
        }
      }
    }
  }
}
</style>
