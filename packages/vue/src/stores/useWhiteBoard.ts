import WhiteBoard from '@/core'
import socketClient from '@/utils/socket'
import { defineStore } from 'pinia'

const wb = new WhiteBoard()

socketClient.on('pages-updated', data => {
  console.log(data)

  wb.import(data)
})
export const useWB = defineStore('page', () => {
  const currentPage = () => {
    return wb.getCurrentPage()
  }
  return { wb, currentPage }
})
