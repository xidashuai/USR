import { OvalOptions, RectangleBounding, Shape } from '.'
import { drawNoSideEffect } from '../utils/Canvas'
import Path from '../utils/Path'
import SelectState from '../utils/SelectState'
import {
  areaInOtherArea,
  calcRectBounding,
  isInRectArea,
  moveVector,
  RectBounding,
  Vector2D
} from '../utils/Vector'

export class Oval extends SelectState implements Shape, OvalOptions {
  constructor(options: OvalOptions) {
    super()
    Object.assign(this, JSON.parse(JSON.stringify(options)))
    // Object.assign(this, options)
  }

  pos?: Vector2D = { x: 0, y: 0 }
  radiusX: number = 0
  radiusY: number = 0
  rotation: number = 0
  startAngle: number = 0
  endAngle: number = Math.PI * 2
  counterclockwise: boolean = true
  fillStyle?: string = 'white'
  strokeStyle?: string = 'black'

  draw(ctx: CanvasRenderingContext2D): void {
    drawNoSideEffect(ctx)(ctx => {
      if (this.selected) {
        const b = new RectangleBounding(this.getRectBounding())
        b.draw(ctx)
      }
      const path = Path.oval(this.pos, this.radiusX, this.radiusY)
      ctx.stroke(path)
    })
  }

  isInnerPos(pos: Vector2D): boolean {
    return false
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
