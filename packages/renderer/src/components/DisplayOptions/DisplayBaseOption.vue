<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="mx-20 mt-3 flex items-center justify-between gap-4 select-none">
    <config-tooltip
      :name="$props.option.name"
      :highlight="isDirty"
    >
      <span
        class="max-w-100"
        v-html="$props.option.description"
      />
      <span> {{ $t('tooltip.default') }}: {{ $props.option.defaultValue }} </span>
    </config-tooltip>

    <div class="flex shrink-0 items-center gap-2">
      <button
        type="button"
        class="hover:text-menu-hover h-6 w-6 cursor-pointer text-base leading-none"
        :class="isDirty ? 'visible' : 'invisible'"
        :title="$t('tooltip.revert')"
        :aria-hidden="!isDirty"
        :tabindex="isDirty ? 0 : -1"
        @click="revert"
      >
        <i class="mdi mdi-undo-variant" />
      </button>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref, toRef } from 'vue';
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
  setup(props) {
    const setting = toRef(props.option);
    // Snapshot the value as loaded from disk; used to detect unsaved edits and to revert.
    const originalValue = ref(JSON.parse(JSON.stringify(setting.value.value)));

    const isDirty = computed(
      () => JSON.stringify(setting.value.value) !== JSON.stringify(originalValue.value),
    );

    const revert = () => {
      setting.value.value = JSON.parse(JSON.stringify(originalValue.value));
    };

    return { isDirty, revert };
  },
});
</script>
