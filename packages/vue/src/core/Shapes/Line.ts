import type { CtxSetting, LineOptions, Shape } from '.'
import { drawNoSideEffect } from '../utils/Canvas'
import Path from '../utils/Path'
import {
  calcRectBounding,
  isInRectArea,
  moveVector,
  RectBounding,
  V2D,
  Vector2D
} from '../utils/Vector'
import { BaseShape } from './BaseShape'

/**
 * 直线
 */
export class Line extends BaseShape implements Shape, LineOptions {
  constructor(options: LineOptions) {
    super()
    this.assign(this, options)
  }
  readonly type = 'line'
  begin?: Vector2D
  end?: Vector2D
  pos?: Vector2D

  draw(ctx: CanvasRenderingContext2D): void {
    drawNoSideEffect(ctx)(ctx => {
      this.assign(ctx, this.ctxSetting)
      const path = Path.line(this.begin, this.end)
      ctx.stroke(path)
      ctx.fill(path)
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
