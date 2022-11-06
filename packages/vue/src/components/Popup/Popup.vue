<template>
  <div class="Popup">
    <div class="Popup_content">
      <template v-if="props.isName === 'join'">
        <div class="Popup_content_title">
          <h2>房间号：{{ props.room }}</h2>
        </div>
        <input type="text" placeholder="请输入用户名" v-model="username" />
        <button @click="join">加入</button>
        <button @click="anonymousJoin">匿名加入</button>
      </template>
      <template v-else-if="props.isName === 'create'">
        <input type="text" placeholder="请输入用户名" v-model="username" />
        <select v-model="isPublic">
          <option value="true">公开</option>
          <option value="false">不公开</option>
        </select>
        <button @click="create">创建</button>
        <button @click="anonymousCreate">匿名创建</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addUserStore } from '@/stores/white'
const router = useRouter()
const props = defineProps<{
  isName: string
  room: string
  roomName: string
}>()

const username = ref('')

const join = () => {
  if (!username.value) {
    alert('请输入用户名')
    return
  }
  const room = props.room
  console.log('room', room)
  //把名字存储到pinia中
  addUserStore().addUser(username.value)
  router.push({
    path: '/white',
    query: {
      room
    }
  })
}
const anonymousJoin = () => {
  // todo:调用接口获取匿名用户名
}
// 选择是否公开
const isPublic = ref('true')
// 创建白板
const create = () => {
  if (username.value && isPublic.value) {
    console.log(username.value, isPublic.value)
    const roomName = props.roomName
    console.log(roomName, '-roomName')
  }
}
// 匿名创建白板
const anonymousCreate = () => {}
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
  .Popup_content {
    width: 400px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .Popup_content_title {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #ccc;
      h2 {
        font-size: 20px;
      }
    }
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
    select {
      width: 80%;
      height: 40px;
      border-radius: 5px;
      outline: none;
      border: 1px solid #1e90ff;
      color: #000;
      padding-left: 10px;
      margin-top: 20px;
    }
    select option {
      color: #000;
    }
  }
}
</style>
