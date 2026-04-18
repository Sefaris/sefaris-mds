<template>
  <display-base-option :option="$props.option">
    <div class="flex items-center gap-4">
      <div class="flex items-center">
        <input
          v-model="input"
          min="0"
          type="number"
          class="border-divider h-6 w-16 border-2 bg-transparent"
        />
        <button @click="addItem(input)">
          <i class="mdi mdi-plus" />
        </button>
      </div>
      <div class="flex w-68 justify-end gap-2">
        <button
          class="cursor-pointer"
          @click="scrollLeft"
        >
          <i class="mdi mdi-skip-backward hover:text-red-300" />
        </button>
        <div
          ref="scrollContainer"
          class="mr-2 flex w-50 snap-x items-center gap-1 overflow-x-hidden"
        >
          <div
            v-for="(item, index) in setting.value"
            :key="index"
            class="border-divider cursor-pointer snap-start border p-0.5 hover:border-red-700 hover:text-red-700"
            @click="removeItem(item as number)"
          >
            <span class="flex w-max items-center">
              {{ item }}
              <i class="mdi mdi-window-close flex h-6 items-center" />
            </span>
          </div>
        </div>
        <button
          class="z-10 cursor-pointer"
          @click="scrollRight"
        >
          <i class="mdi mdi-skip-forward" />
        </button>
      </div>
    </div>
  </display-base-option>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, onMounted, ref, toRef } from 'vue';
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
    const input = ref(0);
    const isOverflow = ref(true);
    const cantScrollLeft = ref(false);
    const cantScrollRight = ref(false);

    const scrollContainer = ref<HTMLDivElement | null>(null);

    const addItem = (item: number) => {
      if ((setting.value.value as Array<number>).includes(item)) return;
      (setting.value.value as Array<number>).push(item);
      (setting.value.value as Array<number>).sort((a, b) => a - b);
      checkScroll();
    };

    const checkScroll = () => {
      if (scrollContainer.value) {
        cantScrollLeft.value = scrollContainer.value.scrollLeft <= 0;
        const maxScrollLeft = scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth;
        cantScrollRight.value = scrollContainer.value.scrollLeft >= maxScrollLeft;
      }
    };

    const scrollLeft = () => {
      checkScroll();
      if (scrollContainer.value) {
        scrollContainer.value.scrollBy({ left: -100, behavior: 'smooth' });
      }
    };

    const scrollRight = () => {
      checkScroll();
      if (scrollContainer.value) {
        scrollContainer.value.scrollBy({ left: 100, behavior: 'smooth' });
      }
    };
    const removeItem = (item: number) => {
      if (!(setting.value.value as Array<number>).includes(item)) return;
      (setting.value.value as Array<number>) = (setting.value.value as Array<number>).filter(
        i => i !== item,
      );
      checkScroll();
    };

    onMounted(() => {
      checkScroll();
    });

    return {
      scrollContainer,
      scrollLeft,
      scrollRight,
      setting,
      input,
      addItem,
      removeItem,
      isOverflow,
      cantScrollRight,
      cantScrollLeft,
    };
  },
});
</script>
