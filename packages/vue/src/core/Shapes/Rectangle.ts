import type { CtxSetting, RectangleOptions, Shape } from '.'
import { drawNoSideEffect } from '../utils/Canvas'
import Path from '../utils/Path'
import {
  calcRectBounding,
  isInArea,
  isInRectArea,
  moveVector,
  RectBounding,
  V2D,
  Vector2D
} from '../utils/Vector'
import { BaseShape } from './BaseShape'

/**
 * 长方形
 */
export class Rectangle extends BaseShape implements Shape, RectangleOptions {
  constructor(options?: RectangleOptions) {
    super()
    this.assign(this, options)
  }

  readonly type = 'rectangle'
  pos: Vector2D = V2D()
  w: number = 0
  h: number = 0
  get center() {
    return {
      x: this.pos.x + Math.floor(this.w / 2),
      y: this.pos.y + Math.floor(this.h / 2)
    }
  }
  get acrossCorner() {
    return {
      x: this.pos.x + this.w,
      y: this.pos.y + this.h
    }
  }
  draw(ctx: CanvasRenderingContext2D): void {
    drawNoSideEffect(ctx)(ctx => {
      this.assign(ctx, this.ctxSetting)
      const path = Path.rectangle(this.pos, this.w, this.h)
      ctx.stroke(path)
      ctx.fill(path)
    })
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
