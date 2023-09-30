<template>
  <RouterLink to="/configuration">Configuration</RouterLink>
  <MessageBox
    v-if="showMessageBox"
    :message="messageBoxDetails.message"
    :type="messageBoxDetails.type"
    :life-time="messageBoxDetails.lifeTime"
    @close="handleCloseMessageBox"
  ></MessageBox>
  <div>
    <button @click="install">Install</button>
  </div>
  <div class="container">
    <ModDetails
      v-if="modsReady && modDetails"
      :mod-item="modDetails"
    />
    <ModList
      v-if="modsReady"
      :mod-list="modList"
      @mod-details="handleModDetails"
      @mod-selected="handleModSelected"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';

import type {Mod} from '#preload';
import {loadMods, loadInstalledMods, installMods} from '#preload';

import ModList from '../components/ModList.vue';
import ModDetails from '../components/ModDetails.vue';
import MessageBox from '../components/MessageBox.vue';
export default defineComponent({
  components: {ModList, ModDetails, MessageBox},
  setup() {
    const modsReady = ref<boolean>(false);
    const modDetails = ref<Mod>();
    const modList: Mod[] = [];
    const selectedMods = ref<Mod[]>([]);
    const showMessageBox = ref<boolean>(false);
    const messageBoxDetails = ref({
      message: '',
      type: 'info',
      lifeTime: 1000,
    });
    onMounted(async () => {
      loadMods().then(mods => {
        modDetails.value = mods[0];
        modList.push(...mods);
        modsReady.value = true;
      });
      selectedMods.value = await loadInstalledMods();
    });

    return {modList, modsReady, modDetails, selectedMods, showMessageBox, messageBoxDetails};
  },
  methods: {
    async install() {
      const clonedMods = JSON.parse(JSON.stringify(this.selectedMods));
      const time = await installMods(clonedMods);
      this.messageBoxDetails = {
        message: `Zainstalowano ${clonedMods.length} modów w ${time}s`,
        type: 'success',
        lifeTime: 15000,
      };
      this.spawnMessageBox(
        this.messageBoxDetails.message,
        this.messageBoxDetails.type,
        this.messageBoxDetails.lifeTime,
      );
    },

    handleModDetails(mod: Mod) {
      this.modDetails = mod;
    },

    handleModSelected({mod, modSelected}: {mod: Mod; modSelected: boolean}) {
      if (modSelected) {
        const insertIndex = this.selectedMods.findIndex(
          selectedMod => selectedMod.directoryName.localeCompare(mod.directoryName) > 0,
        );
        if (insertIndex === -1) {
          this.selectedMods.push(mod);
        } else {
          this.selectedMods.splice(insertIndex, 0, mod);
        }
      } else {
        this.selectedMods.splice(this.selectedMods.indexOf(mod), 1);
      }
    },

    spawnMessageBox(message: string, type: string, lifeTime: number) {
      this.showMessageBox = false;
      setTimeout(() => {
        this.messageBoxDetails = {message, type, lifeTime};
        this.showMessageBox = true;
      }, 10);
    },

    handleCloseMessageBox() {
      this.showMessageBox = false;
    },
  },
});
</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}
</style>
