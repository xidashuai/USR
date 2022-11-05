import { LineOptions, RectangleBounding, Shape } from '.'
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
export class Line implements Shape, LineOptions {
  constructor(options: LineOptions) {
    Object.assign(this, options)
  }
  pos?: Vector2D

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

  begin: Vector2D = V2D()
  end: Vector2D = V2D()
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    if (this.selected) {
      const b = new RectangleBounding(this.getRectBounding())
      b.draw(ctx)
    }
    const path = new Path2D()
    path.moveTo(this.begin.x, this.begin.y)
    path.lineTo(this.end.x, this.end.y)
    ctx.stroke(path)
    ctx.restore()
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
