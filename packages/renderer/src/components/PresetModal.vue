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
      <div
        v-if="basePreset"
        class="flex flex-col gap-1"
      >
        <label class="flex cursor-pointer items-center gap-2">
          <input
            v-model="inheritEnabled"
            type="checkbox"
            class="accent-primary"
          />
          <span
            >{{ $t('modal.inheritFrom') }} <strong>{{ basePreset }}</strong></span
          >
        </label>
        <div
          v-if="inheritEnabled && parentFiles.length"
          class="ml-6 max-h-24 overflow-y-auto text-sm text-gray-400"
        >
          <span class="text-gray-300">{{ $t('modal.inheritFiles') }}:</span>
          <div
            v-for="(file, index) in parentFiles"
            :key="index"
          >
            {{ file }}
          </div>
        </div>
      </div>
      <div class="mt-auto ml-auto flex gap-2 p-px">
        <button
          class="border-divider bg-primary hover:bg-primary-hover rounded-lg border-2 px-2 py-1 text-black"
          @click="addPreset"
        >
          {{ $t('modal.save') }}
        </button>
        <button
          class="border-divider hover:bg-disabled rounded-lg border-2 px-2 py-1"
          @click="$emit('close')"
        >
          {{ $t('modal.close') }}
        </button>
      </div>
    </div>
  </app-modal>
</template>

<script lang="ts">
import { getPresetFiles, loggerError, savePreset, showAlert } from '#preload';
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
    const basePreset = computed(() => modsStore.basePreset);
    const presetName = ref('');
    const inheritEnabled = ref(true);
    const parentFiles = ref<string[]>([]);

    const loadParentFiles = async (presetName: string) => {
      parentFiles.value = await getPresetFiles(presetName);
    };

    const addPreset = async () => {
      const modsCopy = JSON.parse(JSON.stringify(selectedMods.value));
      const inheritsFrom = inheritEnabled.value ? basePreset.value : undefined;
      await savePreset(modsCopy, presetName.value, inheritsFrom)
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
      async () => {
        if (!props.isVisible) {
          return;
        }

        inheritEnabled.value = true;
        parentFiles.value = [];
        if (basePreset.value) {
          await loadParentFiles(basePreset.value);
        }

        nextTick(() => inputRef.value?.inputRef?.focus());
      },
    );
    return {
      inputRef,
      presetName,
      basePreset,
      inheritEnabled,
      parentFiles,

      addPreset,
    };
  },
});
</script>
