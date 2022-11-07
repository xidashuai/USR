<template>
  <IconWrapper @click="click">
    <img :src="brushUrl.icicles" />
  </IconWrapper>
</template>

<script setup lang="ts">
import IconWrapper from './IconWrapper.vue'
import { brushUrl } from '@/assets'
import { useWB } from '@/stores/useWhiteBoard'

const wbStore = useWB()
const { wb } = wbStore
const click = () => {
  const page = wb.getCurrentPage()
  page.useDrawImageBrush('icicles')
}
</script>

<style scoped></style>
