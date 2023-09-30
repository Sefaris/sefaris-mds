<template>
  <div class="mod">
    <input
      v-model="selected"
      class="mod-checkbox"
      type="checkbox"
      @click="emitModSelected(mod, selected)"
    />
    <span
      class="mod-title"
      @click="emitModDetails(mod)"
    >
      {{ mod.title }}
    </span>
  </div>
</template>

<script lang="ts">
import type {Mod} from '#preload';
import {isModInstalled} from '#preload';

import {defineComponent, onMounted, ref} from 'vue';

export default defineComponent({
  components: {},
  props: {
    modItem: {
      type: Object as () => Mod,
      required: true,
    },
  },

  emits: ['modDetails', 'modSelected'],

  setup(props) {
    const selected = ref<boolean>(false);

    onMounted(async () => {
      selected.value = await isModInstalled(props.modItem.id);
    });

    return {mod: props.modItem, selected};
  },
  methods: {
    emitModSelected(mod: Mod, selected: boolean) {
      const modSelected = !selected;
      this.$emit('modSelected', {mod, modSelected});
    },
    emitModDetails(mod: Mod) {
      this.$emit('modDetails', mod);
    },
  },
});
</script>

<style lang="scss">
.mod {
  display: flex;
  gap: 0.25rem;

  &-checkbox {
    appearance: none;
    color: currentColor;
    width: 1rem;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 10%;
    font-size: 2rem;
    &::before {
      content: '-';
      display: grid;
      place-content: center;
    }

    &:checked {
      content: '-';
      color: red;
    }

    &:not(:checked)::before {
      content: '+';
      color: green;
    }
  }

  &-title {
    cursor: pointer;
  }
}
</style>
W powyższym kodzie, po zaznaczeniu checkboxa, zmieniamy jego kolor na czerwony, a przy odznaczeniu
na zielony, za pomocą pseudo-elementu ::before. Możesz dostosować kolory i style do własnych
preferencji.
