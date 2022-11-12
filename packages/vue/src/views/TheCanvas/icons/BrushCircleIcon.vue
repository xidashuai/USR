<template>
  <IconWrapper>
    <img :src="brushUrl.circle" />
  </IconWrapper>
</template>

<script setup lang="ts">
import IconWrapper from './IconWrapper.vue'
import { brushUrl } from '@/assets'
</script>

<style scoped></style>
