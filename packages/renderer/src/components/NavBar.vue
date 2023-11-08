<template>
  <div class="navbar-container">
    <div class="nav">
      <router-link to="/">{{ $t('common.home') }}</router-link>

      <router-link to="/configuration">{{ $t('common.configuration') }}</router-link>
    </div>
    <div class="options">
      <change-locale />
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import ChangeLocale from './ChangeLocale.vue';
export default defineComponent({
    components: { ChangeLocale },

    setup() {
        return {

        };
    },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.navbar-container {
    display: flex;
    height: 30px;
    background-color: $nav-bar-color;

    justify-content: space-between;

    .nav {
        display: flex;

        a {
            display: flex;
            align-items: center;
            padding: $padding-tiny;
            height: 100%;

            &:hover {
                background-color: $nav-bar-hover-color;
            }
        }

    }

    .options {
        display: flex;
        align-items: center;
        padding: $padding-tiny;
        height: 100%;
    }
}
</style>
