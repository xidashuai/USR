import type { RectangleOptions, Shape } from '.'
import { V2D, Vector2D } from '../utils/vector'

/**
 * 长方形
 */
export class Rectangle implements Shape, RectangleOptions {
  pos: Vector2D = V2D()
  w: number = 0
  h: number = 0
  options: {
    fill?: string
    stroke?: string
  }
  constructor({ pos, w, h, ...options }: RectangleOptions = {}) {
    this.pos = pos || V2D()
    this.w = w || 0
    this.h = h || 0
    this.options = options
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.rect(this.pos.x, this.pos.y, this.w, this.h)
    ctx.stroke()
    ctx.closePath()
  }
}
