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
const props = defineProps<{ name: string }>()

// AngleRight
const unFold = ref(false)
const toggleFold = () => {
  unFold.value = !unFold.value
}

const page = wb.getPage(props.name)

// wb.getCurrentPage().sync = () => {
//   // wb.getCurrentPage().layer.addSnapshot()
//   socket.emit('pages-updated', wb.export())
// }
// wb.getCurrentPage().layer.sync = () => {
//   // wb.getCurrentPage().layer.addSnapshot()
//   socket.emit('pages-updated', wb.export())
// }

const debug = () => {
  console.log({ page: wb.currentPageName })
}

const clickBrushIcon = () => {
  wb.getCurrentPage().useDrawBrush()
  debug()
}

const clickBrushCircleIcon = () => {
  wb.getCurrentPage().useDrawImageBrush('circle')
  debug()
}

const clickBrushLciclesIcon = () => {
  wb.getCurrentPage().useDrawImageBrush('icicles')
  debug()
}

const clickRectangleIcon = () => {
  wb.getCurrentPage().useDrawRectangle()
  debug()
}

const clickCircleIcon = () => {
  wb.getCurrentPage().useDrawCircle()
  debug()
}

const clickOvalIcon = () => {
  wb.getCurrentPage().useDrawEllipes()
  debug()
}

const clickLineIcon = () => {
  wb.getCurrentPage().useDrawLine()
  debug()
}

const clickUndoIcon = () => {
  wb.getCurrentPage().undo()
  debug()
}

const clickRedoIcon = () => {
  wb.getCurrentPage().redo()
  debug()
}

const clickAreaIcon = () => {
  wb.getCurrentPage().useSelect()
  debug()
}

const clickTrashIcon = () => {
  wb.getCurrentPage().layer.removeSelected()
  debug()
}

const colorInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  console.log({ color: target.value })
  wb.getCurrentPage().layer.setOnSelected({
    fillStyle: target.value,
    strokeStyle: target.value
  })
  wb.getCurrentPage().sync()
  debug()
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
