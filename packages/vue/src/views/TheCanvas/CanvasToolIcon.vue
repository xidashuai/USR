<template>
  <div class="iconContainer">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.iconContainer {
  @apply h-10 w-10 rounded-full bg-white fill-gray-500 p-2;
  @apply hover:bg-blue-400 hover:fill-gray-100;
}
</style>
