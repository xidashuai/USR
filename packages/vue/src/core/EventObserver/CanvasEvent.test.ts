import { test, expect } from 'vitest'
import { createCanvas } from '../utils/canvas'
import { CanvasEvent } from './index'

const canvas = createCanvas()
const canvasEvent = new CanvasEvent(canvas)

const fn1 = () => {
  console.log('- fn 1')
}
const fn2 = () => {
  console.log('- fn 2')
}
const fn3 = () => {
  console.log('- fn 3')
}

test('should no duplicate listener', () => {
  canvasEvent.add('mousedown', fn1)
  canvasEvent.add('mousedown', fn1)
  expect(canvasEvent.getEventListener('mousedown').size).toBe(1)

  canvasEvent.add('mousedown', fn2)
  expect(canvasEvent.getEventListener('mousedown').size).toBe(2)
})

test('should only has one mouse-down event', () => {
  canvasEvent.mouseDown(fn3)
  expect(canvasEvent.getEventListener('mousedown').size).toBe(1)

  canvasEvent.mouseDown(fn2)
  expect(canvasEvent.getEventListener('mousedown').size).toBe(1)

  canvasEvent.remove('mousedown', fn2)
  expect(canvasEvent.getEventListener('mousedown').size).toBe(0)
})
