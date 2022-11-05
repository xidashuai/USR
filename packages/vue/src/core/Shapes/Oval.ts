import type { OvalOptions, Shape } from '.'
import {
  isInRectArea,
  moveVector,
  RectBounding,
  Vector2D
} from '../utils/Vector'

export class Oval implements Shape, OvalOptions {
  constructor(options: OvalOptions) {
    Object.assign(this, JSON.parse(JSON.stringify(options)))
    // Object.assign(this, options)
  }

  selected?: boolean = false
  toggleSelect() {
    this.selected = !this.selected
  }
  setSelect(): void {
    this.selected = true
  }
  unSelect(): void {
    this.selected = false
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
    ctx.save()
    if (this.selected) {
      ctx.strokeStyle = 'blue'
    }
    const path = new Path2D()
    path.ellipse(
      this.pos.x,
      this.pos.y,
      this.radiusX,
      this.radiusY,
      this.rotation,
      this.startAngle,
      this.endAngle,
      this.counterclockwise
    )
    ctx.stroke(path)
    ctx.restore()
  }

  isInnerPos(pos: Vector2D): boolean {
    return false
  }

  isInArea(area: RectBounding): boolean {
    return isInRectArea(this.pos, area)
  }

  move(x: number, y: number): void {
    moveVector(this.pos, x, y)
  }
}
