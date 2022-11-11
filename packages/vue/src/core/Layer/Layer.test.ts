import { test, expect } from 'vitest'
import { Layer } from './index'
import { createShape } from '../Shapes'
import { createCtx } from '@/core/utils/Canvas'
import _ from 'lodash'

const ctx = createCtx()

const rect1 = createShape({ type: 'rectangle' })
const rect2 = createShape({ type: 'rectangle' })
const layer = new Layer(ctx!)

test('push a shape', () => {
  expect(layer.ctx).toBeDefined()
  layer.pushShape(rect1)
  expect(layer.size).toBe(1)
})

test('pop a shape', () => {
  layer.popShape()
  expect(layer.size).toBe(0)
})

test('remove selected shapes', () => {
  layer.pushShape(rect1)
  layer.pushShape(rect2)
  layer.selected.push(rect2)
  layer.removeSelected()
  expect(layer.size).toBe(1)
})

test('clear all shapes', () => {
  layer.clearShapes()
  expect(layer.size).toBe(0)
})

test('add shape by option', () => {
  layer.addShape({ type: 'rectangle' })
  expect(layer.size).toBe(1)
})

test('import and export', () => {
  const options = [
    {
      type: 'rectangle',
      pos: {
        x: 362.5,
        y: 190.5
      },
      w: 76,
      h: 81
    },
    {
      type: 'circle',
      pos: {
        x: 392.5,
        y: 364.5
      },
      radius: 100
    }
  ]
  layer.import(options)
  expect(layer.size).toBe(2)

  expect(layer.export()).toEqual([
    expect.objectContaining({
      type: 'rectangle',
      pos: {
        x: 362.5,
        y: 190.5
      },
      w: 76,
      h: 81
    }),
    expect.objectContaining({
      type: 'circle',
      pos: {
        x: 392.5,
        y: 364.5
      },
      radius: 100
    })
  ])
})
