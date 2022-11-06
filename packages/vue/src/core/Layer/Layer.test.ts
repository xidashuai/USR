import { test, expect } from 'vitest'
import { Layer } from './index'
import { Rectangle } from '../Shapes'
import { createCtx } from '@/core/utils/Canvas'
import _ from 'lodash'

const ctx = createCtx()

const rect1 = new Rectangle()
const rect2 = new Rectangle()
const rect3 = new Rectangle()
const rect4 = new Rectangle()
const layer = new Layer(ctx!)

test('push', () => {
  expect(layer.ctx).toBeDefined()
  layer.push(rect1)
  expect(layer.size).toBe(1)
})

test('pop', () => {
  layer.pop()
  expect(layer.size).toBe(0)
})

test('remove', () => {
  layer.push(rect1)
  layer.push(rect2)
  expect(layer.size).toBe(2)
  layer.remove(rect1)
  expect(layer.size).toBe(1)
})

test('clear', () => {
  layer.clear()
  expect(layer.size).toBe(0)
})
