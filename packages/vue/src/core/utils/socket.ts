import { io, Socket } from 'socket.io-client'

const socketClient = io('ws://localhost:3080') // when other device like
// android connect
// const socket = io("http://localhost:3000") // when localhost connect

export default socketClient
