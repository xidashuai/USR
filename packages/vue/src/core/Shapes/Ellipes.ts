import type { CtxSetting, EllipesOptions, Shape } from '.'
import { drawNoSideEffect } from '../utils/Canvas'
import Path from '../utils/Path'
import {
  areaInOtherArea,
  calcRectBounding,
  isInRectArea,
  moveVector,
  RectBounding,
  Vector2D
} from '../utils/Vector'

export class Ellipes implements Shape, EllipesOptions {
  constructor(options: EllipesOptions) {
    Object.assign(this, JSON.parse(JSON.stringify(options)))
  }

  readonly type = 'ellipes'
  pos?: Vector2D = { x: 0, y: 0 }
  radiusX?: number = 0
  radiusY?: number = 0
  rotation?: number = 0
  startAngle?: number = 0
  endAngle?: number = Math.PI * 2
  counterclockwise?: boolean = true
  ctxSetting: CtxSetting

  draw(ctx: CanvasRenderingContext2D): void {
    drawNoSideEffect(ctx)(ctx => {
      Object.assign(ctx, this.ctxSetting)
      const path = Path.ellipes(this.pos, this.radiusX, this.radiusY)
      ctx.stroke(path)
      ctx.fill(path)
    })
  }

  isInnerPos(pos: Vector2D): boolean {
    return isInRectArea(pos, this.getRectBounding())
  }

  isInArea(area: RectBounding): boolean {
    return areaInOtherArea(this.getRectBounding(), area)
  }

  move(x: number, y: number): void {
    moveVector(this.pos, x, y)
  }

  getRectBounding(): RectBounding {
    return calcRectBounding(
      { x: this.pos.x - this.radiusX, y: this.pos.y - this.radiusY },
      { x: this.pos.x + this.radiusX, y: this.pos.y + this.radiusY }
    )
  }
}
