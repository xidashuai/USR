<script setup lang="ts">
import { useRouter } from 'vue-router'
import HomeViewCanvasPreview from './PublicRoomPreview.vue'
import BackIcon from '../TheCanvas/icons/BackIcon.vue'
import { PublicWhiteBoard, saveWhiteBoardInfo, userStore } from '@/stores/white'
import { nextTick, onBeforeMount, onMounted, onUpdated, ref } from 'vue'

const router = useRouter()
const back = () => {
  router.push('/')
}
const issucceed = ref('')
const roomList = ref([])
const msg = ref('')
// 延迟获取pinia数据
setTimeout(() => {
  const data = PublicWhiteBoard()
  issucceed.value = data.issucceed
  roomList.value = data.roomList
  msg.value = data.msg
}, 500)

// 加入房间
const joinRoom = (userid, username, roomid, roomname, ispublic) => {
  saveWhiteBoardInfo().saveWhiteBoardInfo(
    userid,
    username,
    roomid,
    roomname,
    ispublic
  )
  userStore().$patch({
    id: userid,
    roomid: roomid,
    username: username
  })
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
