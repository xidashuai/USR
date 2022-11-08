<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-text">404</div>
      <div class="not-found-text">页面不存在</div>
      <div class="not-found-text">页面将在{{ count }}秒后跳转到首页</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const count = ref(5)
const timer = setInterval(() => {
  count.value--
  if (count.value === 0) {
    clearInterval(timer)
    router.push('/')
  }
}, 1000)
</script>
<style lang="scss" scoped>
.not-found {
  background: #4da0b0;
  background: -webkit-linear-gradient(to right, #d39d38, #4da0b0);
  background: linear-gradient(to right, #d39d38, #4da0b0);

  .not-found-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    .not-found-text {
      font-size: 18px;
      color: rgba(60, 60, 60, 0.7);
      margin-top: 20px;
    }
    .not-found-link {
      font-size: 14px;
      color: #d93f30;
      margin-top: 20px;
    }
  }
}
</style>
