<template>
  <div class="wrapper">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.wrapper {
  @apply h-8 w-8 rounded-full bg-white fill-gray-500 p-2;
  @apply hover:bg-blue-400 hover:fill-gray-100;
}
</style>
