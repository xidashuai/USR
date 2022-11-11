<template>
  <div class="canvasPreview">
    <div class="more">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path
          d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z"
        />
      </svg>
    </div>
    <div class="cover"></div>
    <div class="title">{{ props.roomname }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  roomid: number
  roomname: string
  userid: string
}>()
</script>

<style scoped lang="scss">
.canvasPreview {
  @apply relative max-h-64 w-64 overflow-hidden opacity-100;
  @apply hover:opacity-75;
  .more {
    @apply absolute top-0 right-2 h-6 w-6 fill-gray-50 text-gray-50;
  }
  .cover {
    @apply aspect-video w-64 rounded-md border-2 border-solid border-gray-400 bg-gray-900;
  }
  .title {
    @apply p-2;
  }
}
</style>
