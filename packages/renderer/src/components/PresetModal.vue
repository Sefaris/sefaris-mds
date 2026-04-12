<template>
  <app-modal
    :is-visible="$props.isVisible"
    :title="$t('modal.preset')"
  >
    <div class="m-2 flex flex-col gap-2">
      <span>
        {{ $t('modal.presetName') }}
      </span>
      <app-input
        ref="inputRef"
        v-model="presetName"
        :maxlength="100"
      />
      <div class="ml-auto mt-auto flex gap-2 p-px">
        <button
          class="rounded-lg border-2 border-divider bg-primary px-2 py-1 text-black hover:bg-primary-hover"
          @click="addPreset"
        >
          {{ $t('modal.save') }}
        </button>
        <button
          class="rounded-lg border-2 border-divider px-2 py-1 hover:bg-disabled"
          @click="$emit('close')"
        >
          {{ $t('modal.close') }}
        </button>
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts">
import { loggerError, savePreset, showAlert } from '#preload';
import { translate } from '../../../../plugins/i18n';
import { useModsStore } from '../stores/mods-store';
import AppModal from './AppModal.vue';
import { defineComponent, computed, ref, watch, nextTick } from 'vue';
import AppInput from './Forms/AppInput.vue';

export default defineComponent({
  components: { AppInput, AppModal },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const inputRef = ref<InstanceType<typeof AppInput>>();
    const modsStore = useModsStore();
    const selectedMods = computed(() => modsStore.selectedMods);
    const presetName = ref('');
    const addPreset = async () => {
      const modsCopy = JSON.parse(JSON.stringify(selectedMods.value));
      await savePreset(modsCopy, presetName.value)
        .then(() => {
          showAlert('modal.info', translate('alert.presetSaved'), 'info');
        })
        .catch(error => {
          showAlert('modal.error', error.message, 'error');
          loggerError(error.message);
        });
      await modsStore.loadPresets();
      emit('close');
    };

    watch(
      () => props.isVisible,
      () => {
        if (!props.isVisible) {
          return;
        }

        nextTick(() => inputRef.value?.inputRef?.focus());
      },
    );
    return {
      inputRef,
      presetName,

      addPreset,
    };
  },
});
</script>
