import { test, expect } from 'vitest'
import ShapeManager from './index'
import Rectangle from '../Shapes/Rectangle'
import { createCtx } from '@/core/utils/Canvas'

const ctx = createCtx()

const rect = new Rectangle()
const shapeManager = new ShapeManager(ctx!)

test('push', () => {
  expect(shapeManager.ctx).toBeDefined()
  shapeManager.push(rect)
  expect(shapeManager.size).toBe(1)
})

test('pop', () => {
  shapeManager.pop()
  expect(shapeManager.size).toBe(0)
})

test('remove', () => {
  shapeManager.push(rect)
  expect(shapeManager.size).toBe(1)
  shapeManager.remove(rect)
  expect(shapeManager.size).toBe(0)
})
