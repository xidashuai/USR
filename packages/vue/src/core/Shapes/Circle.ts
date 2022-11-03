import type { CircleOptions, Shape } from '.'
import { V2D, Vector2D } from '../utils/vector'

/**
 * 圆形
 */
export class Circle implements Shape, CircleOptions {
  radius: number = 0
  pos: Vector2D = V2D()

  get center() {
    return this.pos
  }
  constructor(options?: CircleOptions) {
    Object.assign(this, options)
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.closePath()

    // 画圆心
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, 1, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
  }
}
