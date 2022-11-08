// 使用pinia 发送请求

import { defineStore } from 'pinia'
import { addUser, createRoom, getRoomInfo } from '@/service/main/main'

export const userStore = defineStore('addUser', {
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
      return { ID, username }
    },
    async getRoomInfo(roomid: number) {
      const roomInfo = await getRoomInfo(roomid)
      const { issucceed, msg } = roomInfo
      return { issucceed, msg }
    },
    // 发送请求创建白板
    async createWhiteBoard(
      ownerid: number,
      roomname: string,
      isPublic: number
    ) {
      const whiteBoardInfo = await createRoom(ownerid, roomname, isPublic)
      console.log(whiteBoardInfo)
      const { issucceed, msg } = whiteBoardInfo
      return { issucceed, msg }
    }
  }
})
// 创建白板
export const saveWhiteBoardInfo = defineStore('saveWhiteBoardInfo', {
  state: () => ({
    userid: 0,
    username: '',
    roomid: 0,
    roomname: '',
    ispublic: false
  }),
  actions: {
    //保存白板信息
    saveWhiteBoardInfo(
      userid: number,
      username: string,
      roomid: number,
      roomname: string,
      ispublic: boolean
    ) {
      this.userid = userid
      this.username = username
      this.roomid = roomid
      this.roomname = roomname
      this.ispublic = ispublic
    }
  },
  getters: {}
})
