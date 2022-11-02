<template>
  <div class="Popup">
    <div class="Popup__content">
      <input type="text" placeholder="请输入用户名" v-model="username" />
      <button @click="join">加入</button>
      <button @click="anonymousJoin">匿名加入</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const username = ref('')
// 获取当前的房间号
const room = 1
console.log(room)

const join = () => {
  if (username.value) {
    router.push(`/whiteboard/${room}`)
  }
}
const anonymousJoin = () => {
  // todo:调用接口获取匿名用户名
}
</script>
<style lang="scss" scoped>
.Popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  .Popup__content {
    width: 300px;
    height: 200px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    input,
    button {
      width: 80%;
      height: 40px;
      border-radius: 5px;
    }
    input {
      outline: none;
      border: 1px solid #1e90ff;
      color: #000;
      padding-left: 10px;
    }
    button {
      margin-top: 20px;
      color: #fff;
      background-color: #1e90ff;
    }
  }
}
</style>
