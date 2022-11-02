/**
 * 2D向量
 */
export interface Vector2D {
  x: number
  y: number
}

export class V2D implements Vector2D {
  public x: number = 0
  public y: number = 0
  public constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }
}

/**
 * 计算两点之间的偏移量
 * @param v1
 * @param v2
 * @returns
 */
export function offset(v1: Vector2D, v2: Vector2D): Vector2D {
  return {
    x: v1.x - v2.x,
    y: v2.y - v2.y,
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
  return Math.sqrt(offsetX ** 2 + offsetY ** 2)
}
