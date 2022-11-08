import WhiteBoard from '@/core'
import { defineStore } from 'pinia'

const wb = new WhiteBoard()

export const useWB = defineStore('page', () => {
  const currentPage = () => {
    console.log(wb.currentIndex)
    return wb.getCurrentPage()
  }
  return { wb, currentPage }
})
