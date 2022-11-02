import { test, expect } from 'vitest'
import { Layer } from './index'
import Rectangle from '../Shapes/Rectangle'
import { createCtx } from '@/core/utils/Canvas'

const ctx = createCtx()

const rect = new Rectangle()
const layer = new Layer(ctx!)

test('push', () => {
  expect(layer.ctx).toBeDefined()
  layer.push(rect)
  expect(layer.size).toBe(1)
})

test('pop', () => {
  layer.pop()
  expect(layer.size).toBe(0)
})

test('remove', () => {
  layer.push(rect)
  expect(layer.size).toBe(1)
  layer.remove(rect)
  expect(layer.size).toBe(0)
})
