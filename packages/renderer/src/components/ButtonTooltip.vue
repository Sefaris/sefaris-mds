<template>
  <div ref="referenceElement">
    <button>
      <i
        class="mdi"
        :class="$props.icon"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
      >
      </i>
    </button>
    <div
      v-if="visible"
      ref="floatingElement"
      :style="tooltipStyles"
      class="z-20 flex w-max flex-col rounded-2xl border-2 border-solid border-divider bg-primary-bg p-2 text-white"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { autoUpdate, flip, shift, useFloating } from '@floating-ui/vue';
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  setup() {
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
      visible.value = true;
    }

    function hideTooltip() {
      visible.value = false;
    }

    const tooltipStyles = computed(() => ({
      position: strategy.value,
      top: `${y.value ?? 0}px`,
      left: `${x.value ?? 0}px`,
    }));

    return {
      showTooltip,
      hideTooltip,
      tooltipStyles,
      visible,
      referenceElement,
      floatingElement,
    };
  },
});
</script>
