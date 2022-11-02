import type { Shape } from '.'
import { V2D, Vector2D } from '../utils/Vector'

interface RectangleOptions {
  position?: Vector2D
  w?: number
  h?: number
}
/**
 * 长方形
 */
export default class Rectangle implements Shape {
  position: Vector2D = new V2D()
  w: number = 0
  h: number = 0
  constructor({ position, w, h }: RectangleOptions = {}) {
    this.position = position || new V2D()
    this.w = w || 0
    this.h = h || 0
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.rect(this.position.x, this.position.y, this.w, this.h)
    ctx.stroke()
    ctx.closePath()
  }
}
