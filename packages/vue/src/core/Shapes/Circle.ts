import type { Shape } from '.'
import { V2D, Vector2D } from '../utils/Vector'

interface CircleOptions extends Shape {
  position?: Vector2D
  radius?: number
}

/**
 * 圆形
 */
export default class Circle implements CircleOptions {
  fill: string
  radius: number
  position: Vector2D
  get center() {
    return this.position
  }

  constructor({ position, radius, fill }: CircleOptions) {
    this.fill = fill
    this.position = position || new V2D()
    this.radius = radius || 0
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.closePath()

    // 画圆心
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, 1, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
  }
}
