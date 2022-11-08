<template>
  <div class="canvasContainer" ref="rootRef">
    <BackIcon @click="back" />
    <AsyncShapeToolBar />
  </div>
</template>

<script setup lang="ts">
import BackIcon from './icons/BackIcon.vue'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useWB } from '@/stores/useWhiteBoard'

import { Rectangle } from '@/core/Shapes'
import { useRouter } from 'vue-router'
import socketClient from '@/utils/socket'

const router = useRouter()

const props = defineProps<{ name: number }>()

const rootRef = ref<HTMLDivElement>(null)
const { wb, currentPage } = useWB()

onMounted(() => {
  const page = wb.getPage(props.name)
  rootRef.value.insertBefore(page.canvas, rootRef.value.firstElementChild)

  // let socket = io('https://www.xdsbty.cn')
  // socket.on('connect', () => {
  //   console.log(socket.id, '监听客户端连接成功-connect')
  // })

  // 使用websocket
  // let socket = new WebSocket('wss://www.xdsbty.cn')
  // socket.onopen = () => {
  //   console.log('监听客户端连接成功-onopen')
  // }
})

socketClient.on('connect', () => {
  console.log('连接成功', { socketId: socketClient.id })
})

socketClient.on('add-shape', wb => {
  console.log(wb)
})

const AsyncShapeToolBar = defineAsyncComponent({
  loader: () => import('./ShapeToolBar.vue'),
  delay: 1000
})

const back = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.canvasContainer {
  @apply relative h-screen w-screen bg-gray-100;
}
</style>
