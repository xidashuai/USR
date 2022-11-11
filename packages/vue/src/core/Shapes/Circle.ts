import type { CircleOptions, CtxSetting, Shape } from '.'
import { drawNoSideEffect } from '../utils/Canvas'
import Path from '../utils/Path'
import {
  areaInOtherArea,
  distance,
  moveVector,
  RectBounding,
  V2D,
  Vector2D
} from '../utils/Vector'
import { BaseShape } from './BaseShape'

/**
 * 圆形
 */
export class Circle extends BaseShape implements Shape, CircleOptions {
  constructor(options?: CircleOptions) {
    super()
    this.assign(this, options)
  }

  readonly type = 'circle'
  pos: Vector2D = V2D()
  radius: number = 0
  startAngle?: number
  endAngle?: number
  counterclockwise?: boolean

  draw(ctx: CanvasRenderingContext2D): void {
    drawNoSideEffect(ctx)(ctx => {
      this.assign(ctx, this.ctxSetting)
      const circle = Path.circle(this.pos, this.radius)
      ctx.stroke(circle)
      ctx.fill(circle)
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
