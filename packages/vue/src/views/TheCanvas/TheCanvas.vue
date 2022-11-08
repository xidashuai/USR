<template>
  <div class="canvasContainer" ref="rootRef">
    <BackIcon />
    <AsyncShapeToolBar />
  </div>
</template>

<script setup lang="ts">
import BackIcon from './icons/BackIcon.vue'
import { defineAsyncComponent, inject, onMounted, ref, defineProps } from 'vue'
import { useWB } from '@/stores/useWhiteBoard'
import socketClient from '@/core/utils/socket'
import { Rectangle } from '@/core/Shapes'

const props = defineProps<{ name: string }>()

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

socketClient.on('add-shape', shapes => {
  console.table(shapes)
  shapes.forEach(shape => {
    currentPage().addShape(new Rectangle(shape))
  })
  currentPage().drawShapes()
})

const AsyncShapeToolBar = defineAsyncComponent({
  loader: () => import('./ShapeToolBar.vue'),
  delay: 1000
})
</script>

<style scoped lang="scss">
.canvasContainer {
  @apply relative h-screen w-screen bg-gray-100;
}
</style>
