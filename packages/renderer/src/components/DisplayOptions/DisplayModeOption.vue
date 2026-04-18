<template>
  <display-base-option :option="$props.option">
    <template v-if="useSelect">
      <span
        v-if="!editing"
        class="hover:text-menu-hover h-6 min-w-50 cursor-pointer text-right"
        @click="startEditing"
      >
        {{ setting.value }}
      </span>
      <select
        v-else
        ref="selectRef"
        :value="String(setting.value)"
        class="border-divider bg-primary-bg text-menu h-6 min-w-50 border-2 px-2 text-right"
        @change="onSelectChange"
        @focusout="editing = false"
      >
        <option
          v-for="(mode, index) in setting.modes!"
          :key="index"
          :value="mode"
          class="bg-primary-bg text-menu"
        >
          {{ mode }}
        </option>
      </select>
    </template>

    <div
      v-else
      class="flex flex-col items-end gap-1"
    >
      <button
        v-for="(mode, index) in setting.modes!"
        :key="index"
        type="button"
        class="flex cursor-pointer items-center gap-3"
        @click="onSelectMode(mode)"
      >
        <span class="text-right">{{ mode }}</span>
        <span
          class="h-5 w-5 rounded-full border-2"
          :class="[setting.value === mode ? 'bg-checkbox-active' : 'bg-checkbox-inactive']"
        />
      </button>
    </div>
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, nextTick, ref, toRef, watchEffect } from 'vue';
import type { ConfigOption } from '@interfaces/ConfigOption';
import DisplayBaseOption from './DisplayBaseOption.vue';

const SELECT_THRESHOLD = 4;

export default defineComponent({
  components: { DisplayBaseOption },

  props: {
    option: {
      type: Object as PropType<ConfigOption>,
      required: true,
    },
  },
  setup(props) {
    const setting = toRef(props.option);
    const editing = ref(false);
    const selectRef = ref<HTMLSelectElement | null>(null);

    const useSelect = computed(() => (setting.value.modes?.length ?? 0) > SELECT_THRESHOLD);

    watchEffect(() => {
      if (editing.value && selectRef.value) {
        selectRef.value.focus();
      }
    });

    const onSelectChange = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      setting.value.value = target.value;
      editing.value = false;
    };

    const onSelectMode = (mode: string) => {
      setting.value.value = mode;
    };

    const startEditing = async () => {
      editing.value = true;
      await nextTick();
      const el = selectRef.value;
      if (!el) return;
      // Open the dropdown immediately so the user can pick without an extra click.
      // showPicker() is available in modern Chromium (Electron); fall back silently.
      const picker = (el as HTMLSelectElement & { showPicker?: () => void }).showPicker;
      if (typeof picker === 'function') {
        try {
          picker.call(el);
        } catch {
          /* user-gesture restrictions or unsupported — ignore */
        }
      }
    };

    return {
      setting,
      useSelect,
      editing,
      selectRef,
      onSelectChange,
      onSelectMode,
      startEditing,
    };
  },
});
</script>
