<template>
  <span class="backIcon">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
      <path
        d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
      />
    </svg>
  </span>
</template>

<script lang="ts" setup></script>

<style scoped>
.backIcon {
  @apply absolute top-4 left-4 h-10 w-10 rounded-lg bg-white p-3 shadow-md;
  @apply hover:bg-blue-400 hover:fill-gray-100;
}
</style>
