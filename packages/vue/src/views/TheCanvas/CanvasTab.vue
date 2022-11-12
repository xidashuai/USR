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
import type { WhiteBoardPage } from '@/core/WhiteBoardPage'

const { id, username } = userStore()

const AsyncTheCanvas = defineAsyncComponent({
  loader: () => import('./TheCanvas.vue'),
  delay: 1000
})

const { wb, getRoomInfo } = userStore()

// const socketClient = getSocket()
console.log({ id, username })

const socketClient = io(`wss://www.xdsbty.cn?roomid=${id}&userid=${username}`, {
  transports: ['websocket']
})
// const socketClient = io('http://localhost:4096', {
//   transports: ['websocket']
// })
const sync = () => {
  socketClient.emit('pages-updated', wb.export())
}

const useSync = (page: WhiteBoardPage) => {
  page.sync = sync
  page.layer.sync = sync
}

socketClient.on('connect', () => {
  console.log('socket.io 连接成功', { id: socketClient.id })
})

// socketClient.on('pages-updated', data => {
//   console.log(JSON.stringify(JSON.parse(data), v => v, 2))

//   wb.import(data)
// })

socketClient.on('chatmessage', data => {
  console.log('chatmessage', data)
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

getRoomInfo(1).then(room => {
  const tabs = []
  for (const key of Object.keys(JSON.parse(room.stastus))) {
    tabs.push({
      title: key,
      name: key,
      closable: true
    })
  }
  pageTabs.value = tabs
  wb.import(room.stastus)

  for (const page of Object.values(wb.pages)) {
    useSync(page)
  }
})

socketClient.on('add-page', pagename => {
  const page = wb.newPage(pagename)
  useSync(page)

  currentTabName.value = pagename
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
