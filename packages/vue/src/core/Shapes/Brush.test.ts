import { test, expect } from 'vitest'
import { V2D, Vector2D } from '../utils/vector'

test('asfd', () => {
  const point = [
    { x: 120, y: 340 },
    { x: 220, y: 240 },
    { x: 320, y: 140 },
    { x: 420, y: 240 }
  ]
})

function getQuadraticBezierPosition(
  start: number,
  ctrl: number,
  end: number,
  t: number
): number {
  if (t < 0.0 || t > 1.0) {
    throw new Error('t的取值范围必须为[0,1]')
  }
  const t1: number = 1.0 - t
  const t2: number = t1 * t1
  return t2 * start + 2.0 * t * t1 * ctrl + t * t * end
}

function getQuadraticBezierVector(
  start: Vector2D,
  ctrl: Vector2D,
  end: Vector2D,
  t: number,
  result: Vector2D | null = null
): Vector2D {
  if (result === null) result = V2D()
  result.x = getQuadraticBezierPosition(start.x, ctrl.x, end.x, t)
  result.y = getQuadraticBezierPosition(start.y, ctrl.y, end.y, t)
  return result
}
