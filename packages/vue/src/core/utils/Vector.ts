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

export function moveVector(v: Vector2D, x: number = 0, y: number = 0) {
  v.x += x
  v.y += y
}

/**
 * 计算两点之间的距离
 * @param v1
 * @param v2
 * @returns
 */
export function distance(v1: Vector2D, v2: Vector2D): number {
  const { x: offsetX, y: offsetY } = offset(v1, v2)
  return Math.round(Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)))
}

/**
 * 在两个数之间插值
 * @param t 插值的比例，在[0,1]之间
 */
export function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

/**
 * 在向量间线性插值
 * @param p1
 * @param p2
 * @returns 插值后的数组
 */
export function insert(p1: Vector2D, p2: Vector2D, step = calcStep(p1, p2, 1)) {
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

/**
 * 贝塞尔曲线标量插值
 * @param start
 * @param ctrl
 * @param end
 * @param t
 * @returns
 */
function getQuadraticBezierPosition(
  start: number,
  ctrl: number,
  end: number,
  t: number
): number {
  if (t < 0.0 || t > 1.0) {
    throw new Error('t的取值范围为[0,1]')
  }
  const t1: number = 1.0 - t
  const t2: number = t1 * t1
  return t2 * start + 2.0 * t * t1 * ctrl + t * t * end
}

/**
 * 贝塞尔曲线向量插值
 * @param start
 * @param ctrl
 * @param end
 * @param t
 * @returns
 */
export function getQuadraticBezierVector(
  start: Vector2D,
  ctrl: Vector2D,
  end: Vector2D,
  t: number
): Vector2D {
  return {
    x: getQuadraticBezierPosition(start.x, ctrl.x, end.x, t),
    y: getQuadraticBezierPosition(start.y, ctrl.y, end.y, t)
  }
}

/**
 * 使用贝塞尔曲线平滑三点
 * @param start
 * @param ctrl
 * @param end
 * @param step
 * @returns
 */
export function smooth3Vector(
  start: Vector2D,
  ctrl: Vector2D,
  end: Vector2D,
  step: number = calcStep(start, ctrl)
): Vector2D[] {
  const result: Vector2D[] = []

  for (let i = 0; i < step; i++) {
    const t = i / step
    const toInsert = getQuadraticBezierVector(start, ctrl, end, t)
    result.push(toInsert)
  }

  result.push(end)
  return result
}

export function arrayIterator(arr: any[]) {
  let i = 0
  const next = () => {
    return arr[i++]
  }
  return { next }
}

/**
 * 平滑路径
 * @param vectors
 */
export function smoothPath(vectors: Vector2D[]) {
  if (vectors.length < 2) {
    return
  }
  const result: Vector2D[] = []

  const v = arrayIterator(vectors)

  let start = v.next()
  let ctrl = v.next()
  let end = v.next()

  while (start && ctrl && end) {
    const sm = smooth3Vector(start, ctrl, end)
    sm.pop()
    result.push(...sm)
    start = end
    ctrl = v.next()
    end = v.next()
  }
  if (ctrl) {
    result.push(...insert(start, ctrl))
  }
  return result
}

/**
 * 计算两点之间插值的数量
 * @param a
 * @param b
 * @param interval 每个插值之间间隔的像素
 * @returns
 */
export function calcStep(
  a: Vector2D,
  b: Vector2D,
  interval: number = 1
): number {
  return Math.floor(distance(a, b) / interval)
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

export function calcRectBounding(a: Vector2D, b: Vector2D): RectBounding {
  const x = a.x < b.x ? a.x : b.x
  const y = a.y < b.y ? a.y : b.y
  const width = Math.abs(b.x - a.x)
  const height = Math.abs(b.y - a.y)

  const left = x
  const top = y
  const right = x + width
  const bottom = y + height
  return {
    x,
    y,
    width,
    height,
    left,
    top,
    right,
    bottom
  }
}

export function calcRectBoundingCorner(rect: RectBounding): {
  lt: Vector2D
  rt: Vector2D
  rb: Vector2D
  lb: Vector2D
} {
  return {
    lt: { x: rect.left, y: rect.top },
    rt: { x: rect.right, y: rect.top },
    rb: { x: rect.right, y: rect.bottom },
    lb: { x: rect.left, y: rect.bottom }
  }
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

/**
 * 函数柯里化 {@link isInRectArea}
 * @param area
 * @returns
 */
export const isInArea = (area: RectBounding) => {
  return (pos: Vector2D) => {
    return isInRectArea(pos, area)
  }
}

export function areaInOtherArea(area1: RectBounding, area2: RectBounding) {
  const isIn = isInArea(area2)
  const corner = calcRectBoundingCorner(area1)
  return isIn(corner.lt) && isIn(corner.rb)
}
