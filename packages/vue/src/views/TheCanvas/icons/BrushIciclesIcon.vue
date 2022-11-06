<template>
  <IconWrapper @click="click">
    <img :src="brushUrl.icicles" />
  </IconWrapper>
</template>

<script setup lang="ts">
import IconWrapper from './IconWrapper.vue'
import { useWhiteBoard } from '@/stores/useWhiteBoard'
import { brushUrl } from '@/assets'
const wb = useWhiteBoard()
const click = () => {
  wb.instance().useDrawImageBrush('icicles')
}
</script>

<style scoped></style>
