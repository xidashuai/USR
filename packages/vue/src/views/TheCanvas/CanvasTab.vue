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
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { userStore } from '@/stores/white'
import io from 'socket.io-client'

const { roomid, username } = userStore()
console.log(roomid, username)

const AsyncTheCanvas = defineAsyncComponent({
  loader: () => import('./TheCanvas.vue'),
  delay: 1000
})

const { wb, getRoomInfo } = userStore()

// const socketClient = getSocket()
console.log({ roomid, username })

const socketClient = io(`wss://www.xdsbty.cn?roomid=2&userid=2`, {
  transports: ['websocket']
})
// const socketClient = io('http://localhost:4096', {
//   transports: ['websocket']
// })
const sync = () => {
  console.log({ query: socketClient.query })
  socketClient.emit('pages-updated', wb.export())
}

const useSync = () => {
  for (const page of Object.values(wb.pages)) {
    page.sync = sync
    page.layer.sync = sync
  }
}

const pageTabs = ref([])

onMounted(async () => {
  const room = await getRoomInfo(roomid)

  const tabs = []
  if (room.stastus && room.stastus.length > 0) {
    wb.import(room.stastus)
    for (const key of Object.keys(JSON.parse(room.stastus))) {
      pageTabs.value.push({
        title: key,
        name: key,
        closable: key.toString() === 'default' ? false : true
      })
    }
  } else {
    pageTabs.value.push({
      title: '默认',
      name: 'default',
      closable: false
    })
  }

  useSync()
})

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
  useSync()
})

socketClient.on('add-page', (pagename: string) => {
  wb.newPage(pagename)
  useSync()

  pageTabs.value.push({
    title: pagename,
    name: pagename,
    closable: true
  })

  currentTabName.value = pagename
})

socketClient.on('remove-page', pagename => {
  wb.deletePage(pagename)
  useSync()
  pageTabs.value = pageTabs.value.filter(page => page.name != pagename)
})

const addTab = () => {
  const newPageName = Date.now().toString()
  // socket
  socketClient.emit('add-page', newPageName)
}

const removeTab = async (targetIndex: number) => {
  const tabs = pageTabs.value

  let pendingRemoveIndex = tabs.findIndex(t => t.name === currentTabName.value)

  const nextActiveIndex =
    tabs[pendingRemoveIndex + 1] || tabs[pendingRemoveIndex - 1]

  socketClient.emit('remove-page', currentTabName.value)
  currentTabName.value = nextActiveIndex.name
  // socket
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
