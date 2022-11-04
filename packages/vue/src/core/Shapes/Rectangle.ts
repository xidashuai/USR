import type { RectangleOptions, Shape } from '.'
import { V2D, Vector2D } from '../utils/Vector'

/**
 * 长方形
 */
export class Rectangle implements Shape, RectangleOptions {
  pos: Vector2D = V2D()
  w: number = 0
  h: number = 0
  constructor(options: RectangleOptions = {}) {
    Object.assign(this, options)
  }
  draw(ctx: CanvasRenderingContext2D): void {
    const path = new Path2D()
    path.rect(this.pos.x, this.pos.y, this.w, this.h)
    ctx.stroke(path)
  }
}
