<template>
  <IconWrapper @click="click">
    <img :src="brushUrl.circle" />
  </IconWrapper>
</template>

<script setup lang="ts">
import IconWrapper from './IconWrapper.vue'
import { useWhiteBoard } from '@/stores/useWhiteBoard'
import { brushUrl } from '@/assets'
const wb = useWhiteBoard()
const click = () => {
  wb.instance().useDrawImageBrush('circle')
}
</script>

<style scoped></style>
