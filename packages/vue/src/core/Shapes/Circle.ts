import { CircleOptions, RectangleBounding, Shape } from '.'
import { drawNoSideEffect } from '../utils/Canvas'
import Path from '../utils/Path'
import SelectState from '../utils/SelectState'
import {
  areaInOtherArea,
  distance,
  isInArea,
  isInRectArea,
  moveVector,
  RectBounding,
  V2D,
  Vector2D
} from '../utils/Vector'

/**
 * 圆形
 */
export class Circle extends SelectState implements Shape, CircleOptions {
  constructor(options?: CircleOptions) {
    super()
    Object.assign(this, options)
  }

  radius: number = 0
  pos: Vector2D = V2D()

  draw(ctx: CanvasRenderingContext2D): void {
    drawNoSideEffect(ctx)(ctx => {
      if (this.selected) {
        const b = new RectangleBounding(this.getRectBounding())
        b.draw(ctx)
      }

      const circle = Path.circle(this.pos, this.radius)
      ctx.stroke(circle)

      // 画圆心
      const center = Path.circle(this.pos, 1)
      ctx.fill(center)
    })
  }

  isInnerPos(pos: Vector2D): boolean {
    return distance(pos, this.pos) < this.radius
  }

  isInArea(area: RectBounding): boolean {
    const bounding = this.getRectBounding()
    return areaInOtherArea(bounding, area)
  }

  move(x: number, y: number): void {
    moveVector(this.pos, x, y)
  }

  getRectBounding(): RectBounding {
    const x = this.pos.x - this.radius
    const y = this.pos.y - this.radius
    const width = this.radius * 2
    const height = width
    const left = x
    const top = y
    const right = x + width
    const bottom = y + height
    return { x, y, width, height, left, top, right, bottom }
  }
}
