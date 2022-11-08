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
  layer.pushShape(rect1)
  expect(layer.size).toBe(1)
})

test('pop', () => {
  layer.popShape()
  expect(layer.size).toBe(0)
})

test('remove', () => {
  layer.pushShape(rect1)
  layer.pushShape(rect2)
  expect(layer.size).toBe(2)
})

test('clear', () => {
  layer.clearShapes()
  expect(layer.size).toBe(0)
})
