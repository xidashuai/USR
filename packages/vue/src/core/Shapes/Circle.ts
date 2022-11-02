import type { Shape } from '.'
import { V2D, Vector2D } from '../utils/Vector'

interface CircleOptions extends Shape {
  center?: Vector2D
  radius?: number
}

/**
 * 圆形
 */
export default class Circle implements CircleOptions {
  fill: string
  center: Vector2D
  radius: number
  constructor({ center: position, radius, fill }: CircleOptions) {
    this.fill = fill
    this.center = position || new V2D()
    this.radius = radius || 0
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.closePath()

    // 画圆心
    ctx.beginPath()
    ctx.arc(this.center.x, this.center.y, 1, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
  }
}
