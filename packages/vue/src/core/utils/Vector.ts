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
 * @returns 偏移向量
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

/**
 * 在两个数之间插值
 * @param t 插值的比例，在[0,1]之间
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * 在向量间线性插值
 * @param p1
 * @param p2
 * @returns 插值后的数组
 */
export function insert(p1: Vector2D, p2: Vector2D) {
  const step = 10
  const result = []
  for (let i = 0; i < step; i++) {
    result.push({
      x: lerp(p1.x, p2.x, i / step),
      y: lerp(p1.y, p2.y, i / step)
    })
  }
  result.push({ ...p2 })

  return result
}

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

export function getQuadraticBezierVector(
  start: Vector2D,
  ctrl: Vector2D,
  end: Vector2D,
  t: number
): Vector2D {
  return {
    x: getQuadraticBezierPosition(start.x, ctrl.x, end.x, t),
    y: getQuadraticBezierPosition(start.y, ctrl.y, ctrl.y, t)
  }
}

const arrayIterator = (arr: any[]) => {
  let i = 0
  const next = () => {
    return arr[i++]
  }
  return { next }
}

/**
 * @todo 转化成贝塞尔曲线向量
 * @param step
 * @param vectors
 */
function insertQBezier(step: number, vectors: Vector2D[]) {
  const result: Vector2D[] = []
  // getQuadraticBezierVector()
  const v = arrayIterator(vectors)

  const start = v.next()
  const ctrl = v.next()
  const end = v.next()
  const t = 0

  for (let i = 1; i < step; i++) {
    const toInsert = getQuadraticBezierVector(start, ctrl, end, t)
    result.push(toInsert)
  }
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

/**
 * 判断点是否在一个长方形区域内
 * @param p
 * @param area
 * @returns
 */
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
