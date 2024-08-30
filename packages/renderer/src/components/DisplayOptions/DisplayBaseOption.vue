<template>
  <div class="mx-20 mt-3 flex select-none items-center justify-between">
    <config-tooltip :name="$props.option.name">
      <span class="max-w-100">
        {{ $props.option.description }}
      </span>
      <span> {{ $t('tooltip.default') }}: {{ $props.option.defaultValue }} </span>
    </config-tooltip>

    <slot />
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { ConfigOption } from '@interfaces/ConfigOption';
import ConfigTooltip from '../ConfigTooltip.vue';
export default defineComponent({
  components: { ConfigTooltip },
  props: {
    option: {
      type: Object as PropType<ConfigOption>,
      required: true,
    },
  },
  setup(_) {
    return {};
  },
});
</script>
