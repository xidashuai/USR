<template>
  <div class="canvasContainer">
    <BackIcon @click="backHome" />
    <canvas width="1260" height="800" ref="canvasRef" />
    <ShapeToolBar />
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import BackIcon from './BackIcon.vue'
import CanvasTool from './CanvasTool.vue'
import ShapeToolBar from './ShapeToolBar.vue'

const backHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.canvasContainer {
  @apply relative h-screen w-screen bg-gray-100;
  canvas {
    @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white;
  }
}
</style>
