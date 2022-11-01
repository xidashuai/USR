import type { IShape } from '.'
import type V2 from '../types/Vector'

interface CircleOptions {
  ctx: CanvasRenderingContext2D
  position: V2
  radius: number
  color: string
}
/**
 * 圆形
 */
export default class Circle implements IShape {
  ctx: CanvasRenderingContext2D
  position: V2
  radius: number
  color: string
  constructor({ ctx, position, radius, color }: CircleOptions) {
    this.ctx = ctx
    this.position = position
    this.radius = radius
    this.color = color
  }
  draw(): void {
    this.ctx.fillStyle = this.color
    this.ctx.strokeStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
    // this.ctx.fill();
    this.ctx.stroke()
    this.ctx.closePath()

    // circle center
    this.ctx.beginPath()
    this.ctx.arc(this.position.x, this.position.y, 1, 0, 2 * Math.PI)
    this.ctx.fill()
    this.ctx.closePath()
  }
}
