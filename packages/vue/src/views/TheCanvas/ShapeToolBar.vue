<template>
  <div class="tool">
    <CanvasToolIcon @click="clickRectangle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM384 80H64C55.16 80 48 87.16 48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80z"
        /></svg
    ></CanvasToolIcon>
    <CanvasToolIcon @click="clickCircle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"
        />
      </svg>
    </CanvasToolIcon>
    <CanvasToolIcon @click="clickLine">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
        />
      </svg>
    </CanvasToolIcon>
  </div>
</template>

<script setup lang="ts">
import CanvasToolIcon from './CanvasToolIcon.vue'
import WB, { useWB } from '@/core'
const canvas = () => {
  return document.querySelector('canvas')
}
const wb = () => useWB(canvas())

const clickRectangle = () => {
  const whiteboard = wb()
  whiteboard.canvasEvent.mouseDown((e: MouseEvent) => {
    whiteboard.dragToDrawRectangle(e)
  })
}
const clickCircle = () => {}
const clickLine = () => {
  const wB = wb()
  wB.canvasEvent.mouseDown((e: MouseEvent) => {
    wB.dragToDrawLine(e)
  })
}
</script>

<style scoped>
.tool {
  @apply absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-gray-200 px-4 py-1 shadow-md;
}
</style>
