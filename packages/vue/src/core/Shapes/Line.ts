import type { LineOptions, Shape } from '.'
import { V2D, Vector2D } from '../utils/vector'

/**
 * 直线
 */
export class Line implements Shape, LineOptions {
  constructor(options: LineOptions) {
    Object.assign(this, options)
  }
  begin: Vector2D = V2D()
  end: Vector2D = V2D()
  draw(ctx: CanvasRenderingContext2D): void {
    const path = new Path2D()
    path.moveTo(this.begin.x, this.begin.y)
    path.lineTo(this.end.x, this.end.y)
    ctx.stroke(path)
  }
}
