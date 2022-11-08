<template>
  <el-tabs
    v-model="currentTabIndex"
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

const { wb } = useWB()

const currentTabIndex = ref<number>(0)

watch(currentTabIndex, () => {
  wb.currentIndex = currentTabIndex.value
})

const pageTabs = ref([
  {
    title: '默认页',
    name: 0,
    closable: false
  }
])

const addTab = () => {
  // 新页
  wb.newPage()

  const activeIndex = pageTabs.value.length
  pageTabs.value.push({
    title: '新页',
    name: activeIndex,
    closable: true
  })

  currentTabIndex.value = activeIndex
}

const removeTab = (targetIndex: number) => {
  // 删除
  wb.deletePage(targetIndex)

  const tabs = pageTabs.value

  let activeIndex = currentTabIndex.value

  const nextActiveIndex = tabs[activeIndex + 1] || tabs[activeIndex - 1]

  currentTabIndex.value = nextActiveIndex.name

  // if (activeIndex === targetIndex) {
  //   tabs.forEach((tab, index) => {
  //     if (tab.name === targetIndex) {
  //       const nextTab = tabs[index + 1] || tabs[index - 1]

  //       if (nextTab) {
  //         activeIndex = nextTab.name
  //       }
  //     }
  //   })
  // }

  // currentTabIndex.value = activeIndex
  // pageTabs.value = tabs.filter(tab => tab.name !== targetIndex)
  pageTabs.value.splice(activeIndex, 1)
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
