import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { WhiteBoard } from '@/core'

// export const useWhiteBoard = defineStore('whiteboard', () => {
//   const canvas = ref<HTMLCanvasElement>(null)
//   const instance = () => {
//     return useWB(canvas.value)
//   }
//   return { canvas, instance }
// })

const wb = new WhiteBoard()

export const useWB = defineStore('page', () => {
  const currentPage = () => wb.getCurrentPage()
  return { wb, currentPage }
})
