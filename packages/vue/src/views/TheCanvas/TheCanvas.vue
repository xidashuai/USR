<template>
  <div class="canvasContainer">
    <BackIcon />
    <canvas width="800" height="450" ref="canvasRef" />
    <CanvasTool />
  </div>
</template>

<script setup lang="ts">
import BackIcon from './BackIcon.vue'
import CanvasTool from './CanvasTool.vue'
</script>

<style scoped lang="scss">
.canvasContainer {
  @apply relative h-screen w-screen bg-gray-100;
  canvas {
    @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white;
  }
}
</style>
