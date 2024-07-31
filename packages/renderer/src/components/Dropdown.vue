<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="dropdown"
    @mouseleave="collapseDropdown"
    @focusout="onFocusOut"
  >
    <div ref="target">
      <button
        :id="dropdownId"
        ref="trigger"
        class="dropdown-btn"
        :class="btnClass"
        type="button"
        aria-haspopup="true"
        :aria-expanded="expanded"
        @mouseenter="expandDropdown"
        @focus="expandDropdown"
      >
        <slot name="activator" />

        <span
          v-if="showCaret"
          class="dropdown-btn-caret"
        > <i class="mdi mdi-chevron-down" /> </span>
      </button>

      <div
        class="dropdown-mask"
        :class="{ prominent: expanded }"
      />
    </div>

    <transition
      appear
      name="appear"
    >
      <div
        v-if="expanded"
        ref="content"
        class="dropdown-container-content"
        :style="dropdownFloatingStyles"
        :aria-labelledby="dropdownId"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { useFloating, autoUpdate, flip, shift } from '@floating-ui/vue';
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    showCaret: {
      type: Boolean,
      default: true,
    },
    btnClass:{
      type:String,
      default: '',
    },
  },
  setup() {
    const dropdownId = ref('dropdown_' + Date.now());
    const expanded = ref(false);
    const trigger = ref(null);
    const content = ref(null);

    const { x, y, strategy } = useFloating(trigger, content, {
      strategy: 'fixed',
      placement: 'bottom-end',
      whileElementsMounted: autoUpdate,
      middleware: [shift(), flip()],
    });

    function expandDropdown() {
      expanded.value = true;
    }

    function collapseDropdown() {
      expanded.value = false;
    }

    function onFocusOut(e: FocusEvent) {
      const currentTarget = e.currentTarget as HTMLElement;
      requestAnimationFrame(() => {
        if (currentTarget?.contains(document.activeElement)) {
          return;
        }
        collapseDropdown();
      });
    }

    const dropdownFloatingStyles = computed(() => ({
      position: strategy.value,
      top: `${y.value ?? 0}px`,
      left: `${x.value ?? 0}px`,
    }));

    return {
      dropdownFloatingStyles,
      trigger,
      content,
      expanded,
      dropdownId,

      expandDropdown,
      collapseDropdown,
      onFocusOut,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';
@import '../../assets/styles/mixins.scss';

.dropdown {
  position: relative;

  &-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    right: 0;
  }

  &-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: transparent;
    color: $text-white;
    border: none;

    &-caret {
      font-size: $font-size-small;
      margin-left: 4px;
    }
  }

  &-container {
    position: absolute;
    right: 0px;

    &.center {
      right: -100%;

      .dropdown-container-content {
        border-radius: $border-radius-huge;
      }
    }

    &-content {
      margin-top: $margin-regular;
      padding: $padding-between;
      width: max-content;
      background-color: $primary-bg;
      border: $border-width-small solid $divider-color;
      border-radius: $border-radius-huge 0 $border-radius-huge $border-radius-huge;
      z-index: 5;

      &-row {
        display: flex;
        transition: background-color $animation-duration-base;
        padding: $padding-minimal;
        border-radius: $border-radius-regular;
        align-items: center;
        justify-content: space-between;

        &:not(:first-child) {
          margin-top: $margin-tiny;
        }

        &:hover {
          background-color: $default-hover;
        }

        &-preview {
          @include center-vertically();
          width: 32px;
          justify-content: center;

          &-img {
            width: 32px;
            height: 32px;
            border-radius: 5px;
            background-size: cover;
            background-position: 25%;
          }
        }

        &-link {
          margin-left: $margin-regular;
          text-align: right;
          justify-content: right;
          @include center-vertically();
        }
      }
    }
  }

  .prominent {
    z-index: 1000;
  }
}
</style>
