<script setup lang="ts">
import { useRouter } from 'vue-router'
import HomeViewCanvasPreview from './PublicRoomPreview.vue'
import BackIcon from '../TheCanvas/icons/BackIcon.vue'
import { PublicWhiteBoard, saveWhiteBoardInfo } from '@/stores/white'
import { onBeforeMount, onMounted, ref } from 'vue'

const router = useRouter()
const back = () => {
  router.push('/')
}

// 获取房间列表

const issucceed = PublicWhiteBoard().issucceed
const roomList = PublicWhiteBoard().roomList
const msg = PublicWhiteBoard().msg

console.log('issucceed', issucceed)
console.log('roomList', roomList)
console.log('msg', msg)
const joinRoom = (userid, username, roomid, roomname, ispublic) => {
  saveWhiteBoardInfo().saveWhiteBoardInfo(
    userid,
    username,
    roomid,
    roomname,
    ispublic
  )
  router.push({
    path: '/white',
    query: {
      room: roomid
    }
  })
}
</script>
<template>
  <div class="root">
    <BackIcon @click="back" />
    <div class="previewContainer">
      <HomeViewCanvasPreview
        v-for="item in roomList"
        :key="item.ID"
        :roomid="item.ID"
        :roomname="item.Roomname"
        :userid="item.Ownerid"
        @click="
          joinRoom(
            item.Ownerid,
            item.Owner.username,
            item.ID,
            item.Roomname,
            item.Public
          )
        "
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.root {
  @apply flex h-screen w-screen bg-gray-100;
  .previewContainer {
    @apply flex h-full w-full flex-auto flex-wrap gap-5 overflow-y-auto p-16;
  }
}
</style>
