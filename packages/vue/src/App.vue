<script setup lang="ts">
import TheCanvas from './views/TheCanvas/TheCanvas.vue'
</script>

<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style scoped>
.app {
  @apply h-screen w-screen;
}
</style>
