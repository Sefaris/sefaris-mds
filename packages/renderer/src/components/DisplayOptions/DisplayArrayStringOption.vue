<template>
  <display-base-option :option="$props.option">
    <div
      ref="dropdown"
      class="relative mx-auto flex max-w-80 items-center"
    >
      <input
        v-model="input"
        class="h-6 w-60 border-2 border-divider bg-transparent"
        type="text"
        @focusin="show = true"
      />
      <button @click="addItem(input)"><i class="mdi mdi-plus"> </i></button>
      <div
        v-if="show"
        class="absolute top-10 max-h-60 w-60 overflow-y-auto rounded-md"
      >
        <div
          v-for="(item, index) in setting.value"
          :key="index"
          class="flex items-center justify-between bg-divider p-1"
        >
          <span class="ml-1">
            {{ item }}
          </span>
          <button
            class="w-9 hover:bg-default-hover"
            @click="removeItem(item)"
          >
            <i class="mdi mdi-delete"></i>
          </button>
        </div>
      </div>
    </div>
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, onMounted, onUnmounted, ref, toRef } from 'vue';
import type { ConfigOption } from '@interfaces/ConfigOption';
import DisplayBaseOption from './DisplayBaseOption.vue';

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
    const show = ref(false);
    const input = ref('');

    const dropdown = ref<HTMLElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
        show.value = false;
      }
    };

    const addItem = (item: string) => {
      if (!item.length) return;
      if ((setting.value.value as Array<string>).includes(item)) return;
      (setting.value.value as Array<string>).push(item);
    };

    const removeItem = (item: string) => {
      if (!(setting.value.value as Array<string>).includes(item)) return;
      (setting.value.value as Array<string>) = (setting.value.value as Array<string>).filter(
        i => i !== item,
      );
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return { setting, show, dropdown, input, addItem, removeItem };
  },
});
</script>

<style></style>
