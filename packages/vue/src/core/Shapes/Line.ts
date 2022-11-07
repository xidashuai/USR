import { LineOptions, RectangleBounding, Shape } from '.'
import { drawNoSideEffect } from '../utils/Canvas'
import Path from '../utils/Path'
import SelectState from '../utils/SelectState'
import {
  calcRectBounding,
  isInRectArea,
  moveVector,
  RectBounding,
  V2D,
  Vector2D
} from '../utils/Vector'

/**
 * 直线
 */
export class Line extends SelectState implements Shape, LineOptions {
  constructor(options: LineOptions) {
    super()
    Object.assign(this, options)
  }

  begin: Vector2D = V2D()
  end: Vector2D = V2D()
  strokeStyle: string
  fillStyle: string

  draw(ctx: CanvasRenderingContext2D): void {
    drawNoSideEffect(ctx)(ctx => {
      if (this.selected) {
        const b = new RectangleBounding(this.getRectBounding())
        b.draw(ctx)
      }
      const path = Path.line(this.begin, this.end)

      if (this.strokeStyle) {
        ctx.strokeStyle = this.strokeStyle
      }
      ctx.stroke(path)

      if (this.fillStyle) {
        ctx.fillStyle = this.fillStyle
        ctx.fill(path)
      }
    })
  }

  isInnerPos(pos: Vector2D): boolean {
    return false
  }

  isInArea(area: RectBounding): boolean {
    if (!isInRectArea(this.begin, area)) {
      return false
    }

    if (!isInRectArea(this.end, area)) {
      return false
    }
    return true
  }

  move(x: number, y: number): void {
    moveVector(this.begin, x, y)
    moveVector(this.end, x, y)
  }

  getRectBounding(): RectBounding {
    return calcRectBounding(this.begin, this.end)
  }
}
