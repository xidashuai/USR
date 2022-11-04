import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useWB } from '@/core'

export const useWhiteBoard = defineStore('whiteboard', () => {
  const canvas = ref<HTMLCanvasElement>(null)
  const instance = () => {
    return useWB(canvas.value)
  }
  return { canvas, instance }
})
