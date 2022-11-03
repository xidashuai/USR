<template>
  <div class="tool">
    <BrushIcon />
    <ReactangleIcon />
    <CircleIcon />
    <OvalIcon />
    <LineIcon />
    <UndoIcon />
    <RedoIcon />
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
</script>

<style scoped>
.tool {
  @apply absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-gray-200 px-4 py-1 shadow-md;
}
</style>
