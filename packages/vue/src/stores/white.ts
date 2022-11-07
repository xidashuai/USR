// 使用pinia 发送请求

import { defineStore } from 'pinia'
import { addUser, getRoomInfo } from '@/service/main/main'

export const addUserStore = defineStore('addUser', {
  state: () => ({
    id: 0,
    username: ''
  }),
  actions: {
    async addUser(userName: string) {
      const addUserName = await addUser(userName)
      const { ID, username } = addUserName.user

      // 保存到state
      this.id = ID
      this.username = username
    },
    async getRoomInfo(roomid: number) {
      const roomInfo = await getRoomInfo(roomid)
      const { issucceed, msg } = roomInfo
      return { issucceed, msg }
    }
  }
})
