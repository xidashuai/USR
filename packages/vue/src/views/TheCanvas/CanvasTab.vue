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
import {
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect
} from 'vue'
import { saveWhiteBoardInfo, userStore } from '@/stores/white'
import io from 'socket.io-client'

// const { roomid, username } = userStore()
const { roomid, userid } = saveWhiteBoardInfo()

const AsyncTheCanvas = defineAsyncComponent({
  loader: () => import('./TheCanvas.vue'),
  delay: 1000
})

const { wb, getRoomInfo } = userStore()

// const socketClient = getSocket()

const socketClient = io(
  `wss://www.xdsbty.cn?roomid=${roomid}&userid=${userid}`,
  {
    transports: ['websocket']
  }
)

socketClient.on('connect', () => {
  console.log('socket.io 连接成功', {
    id: socketClient.id,
    query: socketClient.query
  })
})

socketClient.on('chatmessage', data => {
  console.log('chatmessage', data)
  wb.import(data)
})

socketClient.on('add-page', (pagename: string) => {
  wb.newPage(pagename)
  useSync()

  pageTabs.value.push({
    title: '新页面',
    name: pagename,
    closable: true
  })

  currentTabName.value = pagename
})

socketClient.on('remove-page', pagename => {
  wb.deletePage(pagename)
  useSync()
  pageTabs.value = pageTabs.value.filter(page => page.name != pagename)
  currentTabName.value = pagename
})
// const socketClient = io('http://localhost:4096', {
//   transports: ['websocket']
// })
const syncPage = () => {
  socketClient.emit('pages-updated', wb.export())
}

const useSync = () => {
  for (const page of Object.values(wb.pages)) {
    page.sync = syncPage
    page.layer.sync = syncPage
  }
}

const pageTabs = ref([])

useSync()

// socketClient.on('pages-updated', data => {
//   console.log(JSON.stringify(JSON.parse(data), v => v, 2))

//   wb.import(data)
// })

const currentTabName = ref<string>('default')

watchEffect(() => {
  wb.currentPageName = currentTabName.value
  wb.getCurrentPage().sync = syncPage
  wb.getCurrentPage().layer.sync = syncPage
})

const addTab = () => {
  const newPageName = Date.now().toString()
  // socket
  socketClient.emit('add-page', newPageName)
}

const removeTab = async (targetIndex: number) => {
  const tabs = pageTabs.value

  let pendingRemoveIndex = tabs.findIndex(t => t.name === currentTabName.value)

  const nextActive =
    tabs[pendingRemoveIndex + 1] || tabs[pendingRemoveIndex - 1]

  socketClient.emit('remove-page', nextActive.value)
  // socket
}

onMounted(async () => {
  const room = await getRoomInfo(roomid)

  if (room.stastus && room.stastus.length > 0) {
    wb.import(room.stastus)
    for (const key of Object.keys(JSON.parse(room.stastus))) {
      pageTabs.value.push({
        title: '新页面',
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
  currentTabName.value = 'default'
  wb.currentPageName = 'default'
})

// socketClient.on('bye', (msg: string) => {
//   console.log({ msg })
// })
onUnmounted(() => {
  socketClient.emit('bye', '离开房间')
})
</script>

<style scoped>
.tabs:deep(.el-tabs__content) {
  @apply h-screen w-screen;
}
.tabs:deep(.el-tabs__header) {
  @apply px-10;
}
</style>
