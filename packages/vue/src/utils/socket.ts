// import { io, Socket } from 'socket.io-client'

import io from 'socket.io-client'

// const socketClient = io('ws://localhost:3080') // when other device like
// // android connect
// // const socket = io("http://localhost:3000") // when localhost connect

// export default socketClient

// import { defineStore } from 'pinia'
// import { userStore } from '@/stores/white'
// import { io } from 'socket.io-client'
// import WhiteBoard from '@/core'
// import { useWB } from '@/stores/useWhiteBoard'
// // const wb = new WhiteBoard()
// // const { wb } = useWB()

// const { id, username } = userStore()

export const socketClient = io(`wss://www.xdsbty.cn/?roomid=33`)
socketClient.on('connect', () => {
  console.log({ socketID: socketClient.id })
})

// socketClient.on('pages-updated', data => {
//   console.log(JSON.stringify(JSON.parse(data), v => v, 2))

//   //   wb.import(data)
// })
// socketClient.on('chatmassage', data => {
//   console.log(JSON.stringify(JSON.parse(data), v => v, 2))

//   //   wb.import(data)
// })

// export default socketClient
