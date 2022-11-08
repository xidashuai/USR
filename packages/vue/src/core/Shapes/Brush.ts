import type { BrushOptions, Shape } from '.'
import { drawNoSideEffect } from '../utils/Canvas'
import {
  areaInOtherArea,
  arrayIterator,
  calcRectBounding,
  moveVector,
  RectBounding,
  Vector2D
} from '../utils/Vector'

export class Brush implements Shape, BrushOptions {
  constructor(options: BrushOptions) {
    Object.assign(this, options)
  }

  type = 'brush'
  vectors?: Vector2D[] = [{ x: 0, y: 0 }]
  leftTop: Vector2D
  rightBottom: Vector2D
  draw(ctx: CanvasRenderingContext2D): void {
    drawNoSideEffect(ctx)(ctx => {
      const brushPath = new Path2D()
      const shadowPath = arrayIterator(this.vectors)
      const a = shadowPath.next()
      brushPath.moveTo(a.x, a.y)
      let b = shadowPath.next()
      let c = shadowPath.next()
      while (b || c) {
        // 只有两点之间做直线，有三点做贝塞尔曲线
        c
          ? brushPath.quadraticCurveTo(b.x, b.y, c.x, c.y)
          : brushPath.lineTo(b.x, b.y)
        b = shadowPath.next()
        c = shadowPath.next()
      }
      ctx.stroke(brushPath)
    })
  }

  isInnerPos(pos: Vector2D): boolean {
    return false
  }

  isInArea(area: RectBounding): boolean {
    return areaInOtherArea(this.getRectBounding(), area)
  }

  move(x: number, y: number): void {
    this.vectors.forEach(v => {
      moveVector(v, x, y)
    })
    moveVector(this.leftTop, x, y)
    moveVector(this.rightBottom, x, y)
  }

  getRectBounding(): RectBounding {
    return calcRectBounding(this.leftTop, this.rightBottom)
  }
}
