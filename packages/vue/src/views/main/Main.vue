<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Popup from '@/components/Popup/Popup.vue'
import { ElMessage } from 'element-plus'
import { PublicWhiteBoard, userStore } from '@/stores/white'

const router = useRouter()
const room = ref('')
const roomName = ref('')
const isShow = ref(false)
const name = ref('')
const roomValue = ref('')
const roomNameValue = ref('')
const joinPublicWhiteBoard = () => {
  // 获取房间列表
  PublicWhiteBoard().getPublicWhiteBoard()
  router.push('/publicRoom')
}
const joinPrivateBoard = async () => {
  if (room.value) {
    if (isNaN(Number(room.value))) {
      ElMessage({
        message: '房间号必须是数字',
        type: 'error'
      })
      return
    }
    name.value = 'join'
    const getRoom = await userStore().getRoomInfo(Number(room.value))
    console.log(getRoom)
    if (getRoom.issucceed !== true) {
      ElMessage({
        message: getRoom.msg,
        type: 'error'
      })
      isShow.value = false
    } else {
      roomValue.value = room.value
      isShow.value = true
    }
  } else {
    ElMessage({
      message: '请输入房间号',
      type: 'error'
    })
  }
}
const createPrivateBoard = () => {
  if (roomName.value) {
    isShow.value = true
    name.value = 'create'
    roomNameValue.value = roomName.value
  } else {
    ElMessage({
      message: '请输入白板名字',
      type: 'error'
    })
  }
}

const clickOut = (e: MouseEvent) => {
  const target = e.target as HTMLElement

  if (target.className === 'Popup') {
    isShow.value = false
  }
}
</script>
<template>
  <div class="index">
    <div class="index_header">
      <h1>Whiteboard-Online</h1>
    </div>
    <div class="index_content">
      <div class="index_content_left">
        <div class="index_content_left_content">
          <p>欢迎来到免费的在线白板</p>
          <p>
            这是是一个自由和开源的在线协作白板。它允许多个用户同时在一个虚拟的大型白板上画图。
          </p>
          <p>
            该白板对所有线上用户实时更新，并且状态始终保持。它可以用于许多不同的目的，包括艺术、娱乐、设计和教学。
          </p>
          <p>要与某人实时协作绘制图形，只需向他们发送白板的URL或者房间号。</p>
        </div>
      </div>
      <div class="index_content_right">
        <div class="index_content_right_title">
          <h2>
            每个人都可以使用公共白板。这是一个令人愉快的混乱的地方，你可以会见匿名陌生人，并在一起绘画。那里的一切都是短暂的。
          </h2>
        </div>
        <div class="index_content_right_button">
          <button @click="joinPublicWhiteBoard">进入公共白板</button>
        </div>

        <div class="index_content_right_title">
          <h2>你可以输入房间号加入一个已经存在的白板</h2>
        </div>
        <div class="index_content_right_button">
          <input type="text" placeholder="输入房间号" v-model="room" />
          <button @click="joinPrivateBoard">加入私人白板</button>
        </div>

        <div class="index_content_right_title">
          <h2>
            您可以创建一个可命名的私有白板，只有有知道它的房间号的人都可以访问它；
            您也可以创建公开的白板，所有人都可以在公共的房间列表看到它。
          </h2>
        </div>
        <div class="index_content_right_button">
          <input type="text" placeholder="输入白板名字" v-model="roomName" />
          <button @click="createPrivateBoard">创建白板</button>
        </div>
      </div>
    </div>
  </div>

  <div v-show="isShow">
    <Popup
      @click="clickOut"
      :isName="name"
      :room="roomValue"
      :roomName="roomNameValue"
    />
  </div>
</template>

<style lang="scss" scoped>
.index {
  background-color: #f3f4f6;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .index_header {
    background-color: #fff;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    h1 {
      font-size: 30px;
    }
  }

  .index_content {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 80vh;
    max-width: 1200px;
    margin: 0 auto;
    .index_content_left,
    .index_content_right {
      width: 50%;
      height: 100%;
      background-color: #fff;
      margin-right: 10px;
      border-radius: 10px;
      .index_content_left_content,
      .index_content_right_title {
        padding: 20px;
        p {
          font-size: 20px;
          margin-bottom: 20px;
        }
      }
    }
    .index_content_right {
      .index_content_right_button {
        padding: 20px;
        input {
          width: 100%;
          height: 40px;
          border-radius: 5px;
          border: 1px solid #ccc;
          padding: 0 10px;
          margin-bottom: 20px;

          &:focus {
            outline: none;
            border: 1px solid #1d82f5;
          }
        }
        button {
          width: 100%;
          height: 50px;
          font-size: 20px;
          background-color: #1d82f5;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;

          &:hover {
            background-color: #1d82f5;
            opacity: 0.8;
          }
          &:active {
            background-color: #1d82f5;
            opacity: 0.6;
          }
        }
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      .index_content_left,
      .index_content_right {
        width: 100%;
        margin-right: 0;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
