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
      <TheCanvas :name="item.name" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import TheCanvas from './TheCanvas.vue'
import { useWB } from '@/stores/useWhiteBoard'
import socketClient from '@/utils/socket'

const { wb } = useWB()

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
  console.log({ pagename })

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
  // 新页
  // wb.newPage()

  const activeIndex = pageTabs.value.length
  // pageTabs.value.push({
  //   title: '新页',
  //   name: activeIndex,
  //   closable: true
  // })

  currentTabName.value = activeIndex.toString()

  socketClient.emit('add-page', activeIndex)
}

const removeTab = (targetIndex: number) => {
  // 删除
  // wb.deletePage(targetIndex)

  const tabs = pageTabs.value

  let activeIndex = parseInt(currentTabName.value)

  const nextActiveIndex = tabs[activeIndex + 1] || tabs[activeIndex - 1]

  currentTabName.value = nextActiveIndex.name

  // pageTabs.value.splice(activeIndex, 1)

  socketClient.emit('remove-page', activeIndex)
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
