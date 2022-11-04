import type { CircleOptions, Shape } from '.'
import { V2D, Vector2D } from '../utils/Vector'

/**
 * 圆形
 */
export class Circle implements Shape, CircleOptions {
  constructor(options?: CircleOptions) {
    Object.assign(this, options)
  }

  radius: number = 0
  pos: Vector2D = V2D()
  get center() {
    return this.pos
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const circle = new Path2D()
    circle.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
    ctx.stroke(circle)

    // 画圆心
    const center = new Path2D()
    center.arc(this.pos.x, this.pos.y, 1, 0, 2 * Math.PI)
    ctx.fill(center)
  }
}
