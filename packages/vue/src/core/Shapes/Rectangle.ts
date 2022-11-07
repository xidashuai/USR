import { RectangleBounding, RectangleOptions, Shape } from '.'
import { drawNoSideEffect } from '../utils/Canvas'
import SelectState from '../utils/SelectState'
import {
  calcRectBounding,
  isInArea,
  isInRectArea,
  moveVector,
  RectBounding,
  V2D,
  Vector2D
} from '../utils/Vector'

/**
 * 长方形
 */
export class Rectangle extends SelectState implements Shape, RectangleOptions {
  strokeStyle: string
  fillStyle: string
  constructor(options?: RectangleOptions) {
    super()
    Object.assign(this, options)
  }

  pos: Vector2D = V2D()
  w: number = 0
  h: number = 0
  get center() {
    return {
      x: this.pos.x + Math.floor(this.w / 2),
      y: this.pos.y + Math.floor(this.h / 2)
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawNoSideEffect(ctx)(ctx => {
      const path = new Path2D()
      if (this.selected) {
        const b = new RectangleBounding(this.getRectBounding())
        b.draw(ctx)
      }
      path.rect(this.pos.x, this.pos.y, this.w, this.h)
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

  get acrossCorner() {
    return {
      x: this.pos.x + this.w,
      y: this.pos.y + this.h
    }
  }

  getRectBounding() {
    return calcRectBounding(this.pos, this.acrossCorner)
  }

  isInnerPos(pos: Vector2D): boolean {
    return isInRectArea(pos, this.getRectBounding())
  }

  isInArea(area: RectBounding): boolean {
    const isIn = isInArea(area)
    return isIn(this.pos) && isIn(this.acrossCorner)
  }

  move(x: number, y: number): void {
    moveVector(this.pos, x, y)
  }
}
