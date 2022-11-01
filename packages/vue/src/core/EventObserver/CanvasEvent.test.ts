import { getEventListeners } from 'events'
import { test, it } from 'vitest'
import { JSDOM } from 'jsdom'

test('only one event', () => {
  const canvas = document.createElement('canvas')
  const md1 = () => {
    console.log('- md 1')
  }
  const md2 = () => {
    console.log('- md 2')
  }
  const md3 = () => {
    console.log('- md 3')
  }
  canvas.onmousedown = md1
  console.log(canvas.onmousedown)
  canvas.onmousedown = md2
  canvas.addEventListener('mousedown', md1)
  canvas.addEventListener('mousedown', md2)
  canvas.addEventListener('mousedown', md3)
  getEventListeners(canvas, 'mousedown')
})
