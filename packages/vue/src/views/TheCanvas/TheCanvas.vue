<template>
  <div class="canvasContainer" ref="rootRef">
    <BackIcon @click="back" />
    <AsyncShapeToolBar />
  </div>
</template>

<script setup lang="ts">
import BackIcon from './icons/BackIcon.vue'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { userStore } from '@/stores/white'
import io from 'socket.io-client'

const { wb } = userStore()

const router = useRouter()

const props = defineProps<{ name: string }>()

const rootRef = ref<HTMLDivElement>(null)
// const { wb, currentPage } = useWB()

onMounted(() => {
  const page = wb.newPage(props.name)
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
