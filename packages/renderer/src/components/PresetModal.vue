<template>
  <app-modal
    :is-visible="$props.isVisible"
    title="Preset"
  >
    <div class="m-2 flex flex-col gap-2">
      <span> {{ $t('modal.presetName') }}</span>
      <input
        v-model="presetName"
        class="h-6 border-2 border-divider bg-transparent"
      />
      <div class="ml-auto mt-auto flex gap-2 p-px">
        <button
          class="rounded-lg border border-divider px-2 py-1 hover:bg-disabled"
          @click="addPreset"
        >
          {{ $t('modal.save') }}
        </button>
        <button
          class="rounded-lg border border-divider px-2 py-1 hover:bg-disabled"
          @click="$emit('close')"
        >
          {{ $t('modal.close') }}
        </button>
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts">
import { loggerError, savePreset } from '#preload';
import { translate } from '../../../../plugins/i18n';
import { useModsStore } from '../stores/mods-store';
import AppModal from './AppModal.vue';
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
  components: { AppModal },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  setup(_, { emit }) {
    const modsStore = useModsStore();
    const selectedMods = computed(() => modsStore.selectedMods);
    const presetName = ref('');
    const addPreset = async () => {
      const modsCopy = JSON.parse(JSON.stringify(selectedMods.value));
      await savePreset(modsCopy, presetName.value).catch(error => {
        alert(translate('alert.checkLog'));
        loggerError(error);
      });
      await modsStore.loadPresets();
      emit('close');
    };
    return {
      addPreset,
      presetName,
    };
  },
});
</script>
