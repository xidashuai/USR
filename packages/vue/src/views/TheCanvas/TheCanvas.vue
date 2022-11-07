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

const props = defineProps<{ name: string }>()

const rootRef = ref<HTMLDivElement>(null)
const { wb } = useWB()

onMounted(() => {
  const page = wb.getPage(props.name)
  rootRef.value.insertBefore(page.canvas, rootRef.value.firstElementChild)

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
}
</style>
