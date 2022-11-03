import type { LineOptions, Shape } from '.'
import { V2D, Vector2D } from '../utils/vector'

/**
 * 直线
 */
export class Line implements Shape, LineOptions {
  options: { fill?: string; stroke?: string }
  begin: Vector2D
  end: Vector2D
  constructor({ begin, end, ...options }: LineOptions) {
    this.begin = begin || V2D()
    this.end = end || V2D()
    this.options = options
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.moveTo(this.begin.x, this.begin.y)
    ctx.lineTo(this.end.x, this.end.y)
    ctx.stroke()
    ctx.closePath()
  }
}
