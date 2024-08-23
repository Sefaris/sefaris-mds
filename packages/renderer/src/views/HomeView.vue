<template>
  <nav-bar />
  <main-section />
  <footer-section />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from '../components/NavBar.vue';
import MainSection from '../components/MainSection.vue';
import FooterSection from '../components/FooterSection.vue';
export default defineComponent({
  components: { NavBar, MainSection, FooterSection },
  setup() {


    return {};
  },
});
</script>
