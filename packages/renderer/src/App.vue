<template>
  <div>
    {{ APP_VERSION }}
  </div>
</template>



<script lang="ts" setup>
  const APP_VERSION = import.meta.env.VITE_APP_VERSION;
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 700px;
}

</style>
