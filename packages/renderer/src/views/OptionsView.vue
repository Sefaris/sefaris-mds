<template>
  <div class="flex h-182 flex-col items-center text-menu">
    <config-record :config-name="configName" />
    <div class="flex w-full justify-evenly border-t border-divider py-6">
      <button
        class="h-12 w-45 bg-[url('../assets/images/option-button.png')] bg-cover bg-no-repeat font-gothic text-2xl hover:text-menu-hover"
        @click="$router.back()"
      >
        <span
          class="block transition-transform duration-150 ease-in-out active:translate-x-0.5 active:translate-y-0.5"
        >
          Wróć
        </span>
      </button>

      <button
        class="h-12 w-45 bg-[url('../assets/images/option-button.png')] bg-cover bg-no-repeat font-gothic text-2xl hover:text-menu-hover"
        @click="saveConfig"
      >
        <span
          class="block transition-transform duration-150 ease-in-out active:translate-x-0.5 active:translate-y-0.5"
        >
          Zapisz
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ConfigRecord from '../components/ConfigRecord.vue';

export default defineComponent({
  components: { ConfigRecord },
  setup() {
    const route = useRoute();
    const configName = ref<string>((route.params.ini as string) || '');

    const saveConfig = () => {
      console.log(`Saving ${configName.value}`);
    };

    watch(
      () => route.params.ini,
      newVal => {
        if (newVal) {
          configName.value = newVal as string;
        }
      },
    );

    return { saveConfig, configName };
  },
});
</script>
