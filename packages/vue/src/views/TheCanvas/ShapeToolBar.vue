<template>
  <div class="tool" :class="{ toolUnFold: unFold }">
    <AngleRight
      class="foldIcon"
      :class="{ actived: unFold }"
      @click="toggleFold"
    />
    <div class="toolBar" :class="{ toolBarUnFold: unFold }">
      <BrushIcon />
      <BrushIciclesIcon />
      <BrushCircleIcon />
    </div>
    <div class="toolBar" :class="{ toolBarUnFold: unFold }">
      <ReactangleIcon />
      <CircleIcon />
      <OvalIcon />
      <LineIcon />
    </div>
    <div class="toolBar" :class="{ toolBarUnFold: unFold }">
      <UndoIcon />
      <RedoIcon />
      <AreaIcon />
    </div>
  </div>
</template>

<script setup lang="ts">
import ReactangleIcon from './icons/ReactangleIcon.vue'
import CircleIcon from './icons/CircleIcon.vue'
import LineIcon from './icons/LineIcon.vue'
import OvalIcon from './icons/OvalIcon.vue'
import UndoIcon from './icons/UndoIcon.vue'
import RedoIcon from './icons/RedoIcon.vue'
import BrushIcon from './icons/BrushIcon.vue'
import AreaIcon from './icons/AreaIcon.vue'
import BrushIciclesIcon from './icons/BrushIciclesIcon.vue'
import AngleRight from './icons/AngleRight.vue'
import BrushCircleIcon from './icons/BrushCircleIcon.vue'

import { ref } from 'vue'

const unFold = ref(true)
const toggleFold = () => {
  unFold.value = !unFold.value
}
</script>

<style scoped>
.tool {
  @apply absolute top-2 left-1/2 flex -translate-x-1/2 gap-6 overflow-hidden rounded-lg bg-white py-1 px-4 drop-shadow-lg;
}

.toolUnFold {
  @apply overflow-visible;
}
.toolBar {
  @apply flex h-12 flex-col items-center gap-2 overflow-hidden rounded-full bg-gray-200 p-2 shadow-inner;
  @apply hover:h-fit hover:overflow-visible;
}

.toolBarUnFold {
  @apply h-fit overflow-visible;
}

.foldIcon {
  @apply m-1;
}
.actived {
  @apply rotate-90;
}
</style>
