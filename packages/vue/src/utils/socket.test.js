/* eslint-disable no-undef */
const io = require('socket.io-client')

// const socketClient = io(`wss://www.xdsbty.cn/?roomid=33`)
const socketClient = io('wss://127.0.0.1:3080')

console.log('=====run')

try {
  socketClient.connect()
} catch (error) {
  console.log(error)
}

socketClient.on('connect', () => {
  console.log({ id: socketClient.id })
})

socketClient.on('chatmessage', s => {
  console.log({ s })
})

socketClient.on('test', s => {
  console.log({ s })
})

setTimeout(() => {
  console.log('emit')
  socketClient.emit('pages-updated', 'this is a message')
  console.log('this is message')

  socketClient.emit('test', 'this is test')
  console.log('this is test')
}, 3000)
