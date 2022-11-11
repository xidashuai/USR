import { test, expect } from 'vitest'
import type { RectangleOptions } from '.'
import { Circle } from './Circle'
import { createShape } from './createShape'
import { Rectangle } from './Rectangle'

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
    type: 'rectangle',
    pos: {
      x: 392.5,
      y: 364.5
    },
    w: 128,
    h: 100
  },
  {
    type: 'rectangle',
    pos: {
      x: 685.5,
      y: 369.5
    },
    w: 169,
    h: 88
  },
  {
    type: 'rectangle',
    pos: {
      x: 741.5,
      y: 273.5
    },
    w: 105,
    h: 55
  }
]

test('create shape', () => {
  const shape = createShape<'rectangle'>(options[0] as RectangleOptions)
  expect(shape).toBeInstanceOf(Rectangle)

  const s2 = createShape<'circle'>({ type: 'circle' })
  expect(s2).toBeInstanceOf(Circle)

  const s3 = createShape<'brush'>({ type: 'brush' })
  expect(s3)
})
