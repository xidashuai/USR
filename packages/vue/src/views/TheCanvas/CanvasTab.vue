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

const { wb } = useWB()

const currentTabName = ref<string>(wb.currentPageID)

watch(currentTabName, () => {
  wb.currentPageID = currentTabName.value
})

const pageTabs = ref([
  {
    title: '默认页',
    name: wb.currentPageID,
    closable: false
  }
])

const addTab = () => {
  // 新页
  const id = wb.newId()
  wb.newPage(id)
  wb.currentPageID = id

  const newTabName = id

  pageTabs.value.push({
    title: '新页',
    name: newTabName,
    closable: true
  })

  currentTabName.value = newTabName
}

const removeTab = (targetName: string) => {
  // 删除
  wb.deletePage(targetName)

  const tabs = pageTabs.value

  let activeName = currentTabName.value

  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  currentTabName.value = activeName
  pageTabs.value = tabs.filter(tab => tab.name !== targetName)
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
