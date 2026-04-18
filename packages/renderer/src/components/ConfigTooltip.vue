<template>
  <div
    ref="referenceElement"
    :class="truncate ? 'min-w-0 flex-1 overflow-hidden' : ''"
  >
    <span
      :class="['text-left', truncate ? 'block truncate' : 'min-w-50', highlight ? 'fake-bold' : '']"
      :title="truncate ? $props.name : undefined"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
    >
      {{ $props.name }}
    </span>
    <div
      v-if="visible"
      ref="floatingElement"
      :style="tooltipStyles"
      class="border-divider bg-primary-bg flex w-max flex-col rounded-2xl border-2 border-solid p-2"
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
    name: {
      type: String,
      required: true,
    },
    truncate: {
      type: Boolean,
      default: true,
    },
    highlight: {
      type: Boolean,
      default: false,
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
