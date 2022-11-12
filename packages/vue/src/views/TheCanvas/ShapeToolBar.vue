<template>
  <div class="tool" :class="{ toolUnFold: unFold }">
    <AngleRight
      class="foldIcon"
      :class="{ actived: unFold }"
      @click="toggleFold"
    />
    <label>画笔</label>
    <div class="toolBar" :class="{ toolBarUnFold: unFold }">
      <BrushIcon @click="clickBrushIcon" />
      <BrushIciclesIcon @click="clickBrushLciclesIcon" />
      <BrushCircleIcon @click="clickBrushCircleIcon" />
    </div>
    <label>形状</label>
    <div class="toolBar" :class="{ toolBarUnFold: unFold }">
      <ReactangleIcon @click="clickRectangleIcon" />
      <CircleIcon @click="clickCircleIcon" />
      <OvalIcon @click="clickOvalIcon" />
      <LineIcon @click="clickLineIcon" />
    </div>
    <label>操作</label>
    <div class="toolBar" :class="{ toolBarUnFold: unFold }">
      <UndoIcon @click="clickUndoIcon" />
      <RedoIcon @click="clickRedoIcon" />
      <AreaIcon @click="clickAreaIcon" />
      <TrashIcon @click="clickTrashIcon" />
    </div>
    <div class="colorPicker">
      <label class="colorIcon" for="head">
        颜色
        <input
          type="color"
          id="head"
          name="head"
          value="#e66465"
          @change="colorInput"
        />
      </label>
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
import TrashIcon from './icons/TrashIcon.vue'
import { userStore } from '@/stores/white'
const { wb, getSocket } = userStore()
const socket = getSocket()

// AngleRight
const unFold = ref(false)
const toggleFold = () => {
  unFold.value = !unFold.value
}

// wb.getCurrentPage().layer.afterDraw = () => {
//   socket.emit('pages-updated', wb.export())
// }
wb.getCurrentPage().sync = () => {
  socket.emit('pages-updated', wb.export())
}

const clickBrushIcon = () => {
  wb.getCurrentPage().useDrawBrush()
}

const clickBrushCircleIcon = () => {
  wb.getCurrentPage().useDrawImageBrush('circle')
}

const clickBrushLciclesIcon = () => {
  wb.getCurrentPage().useDrawImageBrush('icicles')
}

const clickRectangleIcon = () => {
  wb.getCurrentPage().useDrawRectangle()
}

const clickCircleIcon = () => {
  wb.getCurrentPage().useDrawCircle()
}

const clickOvalIcon = () => {
  wb.getCurrentPage().useDrawEllipes()
}

const clickLineIcon = () => {
  wb.getCurrentPage().useDrawLine()
}

const clickUndoIcon = () => {
  wb.getCurrentPage().undo()
}

const clickRedoIcon = () => {
  wb.getCurrentPage().redo()
}

const clickAreaIcon = () => {
  wb.getCurrentPage().useSelect()
}

const clickTrashIcon = () => {
  wb.getCurrentPage().layer.removeSelected()
}

const colorInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  console.log({ color: target.value })
  wb.getCurrentPage().layer.setOnSelected(
    {
      fillStyle: target.value,
      strokeStyle: target.value
    },
    () => {
      socket.emit('pages-updated', wb.export())
    }
  )
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

.colorPicker {
  @apply w-8 shadow-md;
}
.colorIcon {
  @apply rounded-full;
}
.colorIcon > input {
  @apply h-8 w-8 rounded-full;
}
</style>
