<template>
  <div class="canvasContainer">
    <BackIcon @click="backHome" />
    <canvas width="1260" height="800" ref="canvasRef" />
    <AsyncShapeToolBar />
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import BackIcon from './icons/BackIcon.vue'
import { defineAsyncComponent, inject, onMounted, ref } from 'vue'
import { useWhiteBoard } from '@/stores/useWhiteBoard'

const backHome = () => {
  router.push('/')
}

const wb = useWhiteBoard()
const canvasRef = ref<HTMLCanvasElement>(null)

onMounted(() => {
  wb.canvas = canvasRef.value
  // let socket = io('https://www.xdsbty.cn')
  // socket.on('connect', () => {
  //   console.log(socket.id, '监听客户端连接成功-connect')
  // })

  // 使用websocket
  let socket = new WebSocket('wss://www.xdsbty.cn')
  socket.onopen = () => {
    console.log('监听客户端连接成功-onopen')
  }
})

const AsyncShapeToolBar = defineAsyncComponent({
  loader: () => import('./ShapeToolBar.vue'),
  delay: 1000
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
