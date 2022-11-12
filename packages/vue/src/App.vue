<script setup lang="ts">
import TheCanvas from './views/TheCanvas/TheCanvas.vue'
</script>

<template>
  <div class="app">
    <Suspense>
      <router-view />
    </Suspense>
  </div>
</template>

<style scoped>
.app {
  @apply h-screen w-screen;
}
</style>
