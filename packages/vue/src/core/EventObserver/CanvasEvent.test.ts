import { test, expect } from 'vitest'
import { createCanvas } from '../utils/Canvas'
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

test('没有重复的方法', () => {
  canvasEvent.add('mousedown', fn1)
  canvasEvent.add('mousedown', fn1)
  expect(canvasEvent.getEventListener('mousedown').size).toBe(1)

  canvasEvent.add('mousedown', fn2)
  expect(canvasEvent.getEventListener('mousedown').size).toBe(2)
})

test('setMouseDown(): 一个mousedown事件只有一个listener', () => {
  canvasEvent.setMouseDown(fn3)
  expect(canvasEvent.getEventListener('mousedown').size).toBe(1)

  canvasEvent.setMouseDown(fn2)
  expect(canvasEvent.getEventListener('mousedown').size).toBe(1)

  canvasEvent.remove('mousedown', fn2)
  expect(canvasEvent.getEventListener('mousedown').size).toBe(0)
})
