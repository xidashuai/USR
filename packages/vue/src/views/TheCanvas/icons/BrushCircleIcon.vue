<template>
  <IconWrapper @click="click">
    <img :src="brushUrl.circle" />
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
  page.useDrawImageBrush('circle')
}
</script>

<style scoped></style>
