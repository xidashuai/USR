import type { CircleOptions, Shape } from '.'
import { drawNoSideEffect } from '../utils/Canvas'
import Path from '../utils/Path'
import {
  areaInOtherArea,
  distance,
  isInArea,
  isInRectArea,
  moveVector,
  RectBounding,
  V2D,
  Vector2D
} from '../utils/Vector'

/**
 * 圆形
 */
export class Circle implements Shape, CircleOptions {
  constructor(options?: CircleOptions) {
    Object.assign(this, options)
  }

  type = 'cricle'
  radius: number = 0
  pos: Vector2D = V2D()
  fillStyle: string
  strokeStyle: string

  draw(ctx: CanvasRenderingContext2D): void {
    drawNoSideEffect(ctx)(ctx => {
      const circle = Path.circle(this.pos, this.radius)

      if (this.strokeStyle) {
        ctx.strokeStyle = this.strokeStyle
      }
      ctx.stroke(circle)

      if (this.fillStyle) {
        ctx.fillStyle = this.fillStyle
        ctx.fill(circle)
      }

      // 画圆心
      const center = Path.circle(this.pos, 1)
      ctx.fill(center)
    })
  }

  isInnerPos(pos: Vector2D): boolean {
    return distance(pos, this.pos) < this.radius
  }

  isInArea(area: RectBounding): boolean {
    const bounding = this.getRectBounding()
    return areaInOtherArea(bounding, area)
  }

  move(x: number, y: number): void {
    moveVector(this.pos, x, y)
  }

  getRectBounding(): RectBounding {
    const x = this.pos.x - this.radius
    const y = this.pos.y - this.radius
    const width = this.radius * 2
    const height = width
    const left = x
    const top = y
    const right = x + width
    const bottom = y + height
    return { x, y, width, height, left, top, right, bottom }
  }
}
