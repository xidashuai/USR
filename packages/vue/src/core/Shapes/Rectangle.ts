import { RectangleBounding, RectangleOptions, Shape } from '.'
import {
  calcRectBounding,
  isInRectArea,
  moveVector,
  RectBounding,
  V2D,
  Vector2D
} from '../utils/Vector'

/**
 * 长方形
 */
export class Rectangle implements Shape, RectangleOptions {
  constructor(options?: RectangleOptions) {
    Object.assign(this, options)
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
    ctx.save()
    const path = new Path2D()
    if (this.selected) {
      const b = new RectangleBounding(this.getRectBounding())
      b.draw(ctx)
    }
    path.rect(this.pos.x, this.pos.y, this.w, this.h)
    ctx.stroke(path)
    ctx.restore()
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
    return isInRectArea(this.center, area)
  }

  move(x: number, y: number): void {
    moveVector(this.pos, x, y)
  }
}
