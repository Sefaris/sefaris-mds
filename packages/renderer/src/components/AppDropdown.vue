<template>
  <div
    class="z-10 flex flex-col items-center"
    @mouseleave="collapseDropdown"
    @focusout="onFocusOut"
  >
    <button
      ref="trigger"
      class="flex h-8 items-center bg-transparent"
      @mouseenter="expandDropdown"
      @focus="expandDropdown"
    >
      <slot name="activator" />

      <span
        v-if="showCaret"
        class="ml-1"
      >
        <i class="mdi mdi-chevron-down mdi-small" />
      </span>
    </button>
    <div
      v-if="expanded"
      ref="content"
      class="flex w-max flex-col rounded-bl-2xl rounded-br-2xl rounded-tl-2xl border-2 border-solid border-divider bg-primary-bg p-2"
      :style="dropdownFloatingStyles"
    >
      <slot />
    </div>
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
  },
  setup() {
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

      expandDropdown,
      collapseDropdown,
      onFocusOut,
    };
  },
});
</script>
