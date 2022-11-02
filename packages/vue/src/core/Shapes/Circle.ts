import type { Shape } from '.'
import { V2D, Vector2D } from '../utils/Vector'

interface CircleOptions {
  position?: Vector2D
  radius?: number
  color?: string
}

/**
 * 圆形
 */
export default class Circle implements Shape, CircleOptions {
  position: Vector2D
  radius: number
  color: string
  constructor({ position, radius, color }: CircleOptions) {
    this.position = position || new V2D()
    this.radius = radius || 0
    this.color = color || 'black'
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
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
