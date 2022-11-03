/**
 * 2D向量
 */
export interface Vector2D {
  x: number
  y: number
}

function toVector2D(x: number = 0, y: number = 0): Vector2D {
  return { x, y }
}
export const V2D = toVector2D

/**
 * 计算两点之间的偏移量
 * @param v1
 * @param v2
 * @returns
 */
export function offset(v1: Vector2D, v2: Vector2D): Vector2D {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y
  }
}

/**
 * 计算两点之间的距离
 * @param v1
 * @param v2
 * @returns
 */
export function distance(v1: Vector2D, v2: Vector2D): number {
  const { x: offsetX, y: offsetY } = offset(v1, v2)
  return Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2))
}

export interface Rect {
  width: number
  height: number
}

export interface RectBounding extends Rect {
  left: number
  right: number
  bottom: number
  top: number
  x: number
  y: number
}

export function isInRectArea(p: Vector2D, area: RectBounding) {
  if (p.x < area.left) {
    return false
  }
  if (p.x > area.right) {
    return false
  }
  if (p.y < area.top) {
    return false
  }
  if (p.y > area.bottom) {
    return false
  }
  return true
}
