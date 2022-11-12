<template>
  <el-tabs
    v-model="currentTabName"
    type="border-card"
    class="tabs"
    @tab-remove="removeTab"
    @tab-add="addTab"
    addable
  >
    <el-tab-pane
      v-for="item in pageTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="item.closable"
    >
      <AsyncTheCanvas :name="item.name" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref, watch } from 'vue'
import { userStore } from '@/stores/white'
import io from 'socket.io-client'

const AsyncTheCanvas = defineAsyncComponent({
  loader: () => import('./TheCanvas.vue'),
  delay: 1000
})

const { wb, getSocket } = userStore()

// const socketClient = getSocket()
const socketClient = io(`wss://www.xdsbty.cn/?roomid=33`)

socketClient.on('connect', () => {
  console.log('socket.io 连接成功', { id: socketClient.id })
})

socketClient.on('pages-updated', data => {
  console.log(JSON.stringify(JSON.parse(data), v => v, 2))

  wb.import(data)
})

socketClient.on('chatmessage', data => {
  console.log(
    'chatmessage',
    JSON.stringify(JSON.parse(data), v => v, 2)
  )
  wb.import(data)
})

const currentTabName = ref<string>('default')

watch(currentTabName, () => {
  wb.currentPageName = currentTabName.value
})

const pageTabs = ref([
  {
    title: '默认页',
    name: 'default',
    closable: false
  }
])

socketClient.on('add-page', pagename => {
  wb.newPage(pagename)
  pageTabs.value.push({
    title: '新页面',
    name: pagename,
    closable: true
  })
})

socketClient.on('remove-page', pagename => {
  wb.deletePage(pagename)
  pageTabs.value = pageTabs.value.filter(page => page.name != pagename)
})

const addTab = () => {
  const newPageName = pageTabs.value.length.toString()
  currentTabName.value = newPageName.toString()
  // socket
  socketClient.emit('add-page', newPageName)
}

const removeTab = async (targetIndex: number) => {
  const tabs = pageTabs.value

  let pendingRemoveTabName = parseInt(currentTabName.value)

  const nextActiveIndex =
    tabs[pendingRemoveTabName + 1] || tabs[pendingRemoveTabName - 1]

  currentTabName.value = nextActiveIndex.name
  // socket
  socketClient.emit('remove-page', pendingRemoveTabName)
}
</script>

<style scoped>
.tabs:deep(.el-tabs__content) {
  @apply h-screen w-screen;
}
.tabs:deep(.el-tabs__header) {
  @apply px-10;
}
</style>
