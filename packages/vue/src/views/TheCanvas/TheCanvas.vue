<template>
  <div class="canvasContainer">
    <BackIcon />
    <canvas width="800" height="450" ref="canvasRef" />
    <AsyncShapeToolBar />
  </div>
</template>

<script setup lang="ts">
import BackIcon from './icons/BackIcon.vue'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useWhiteBoard } from '@/stores/useWhiteBoard'

const wb = useWhiteBoard()
const canvasRef = ref<HTMLCanvasElement>(null)

onMounted(() => {
  wb.canvas = canvasRef.value
})

const AsyncShapeToolBar = defineAsyncComponent({
  loader: () => import('./ShapeToolBar.vue'),
  delay: 10000
})
</script>

<style scoped lang="scss">
.canvasContainer {
  @apply relative h-screen w-screen bg-gray-100;
  canvas {
    @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white;
  }
}
</style>
