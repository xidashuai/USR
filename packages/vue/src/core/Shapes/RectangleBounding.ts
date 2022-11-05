import type { RectangleBoundingOptions, RectangleOptions, Shape } from '.'
import type { RectBounding, Vector2D } from '../utils/Vector'

/**
 * 长方形
 */
export class RectangleBounding implements Shape, RectangleBoundingOptions {
  constructor(options?: RectangleOptions | RectBounding) {
    Object.assign(this, options)
  }
  left: number
  right: number
  bottom: number
  top: number
  x: number
  y: number
  width: number
  height: number

  center() {
    return { x: this.left + this.width / 2, y: this.top + this.height / 2 }
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    const path = new Path2D()
    path.rect(this.left, this.top, this.width, this.height)

    const ltCircle = new Path2D()
    ltCircle.arc(this.left, this.top, 6, 0, 2 * Math.PI)

    const rtCircle = new Path2D()
    rtCircle.arc(this.right, this.top, 6, 0, 2 * Math.PI)

    const rbCircle = new Path2D()
    rbCircle.arc(this.right, this.bottom, 6, 0, 2 * Math.PI)

    const lbCircle = new Path2D()
    path.moveTo(this.left, this.bottom)
    lbCircle.arc(this.left, this.bottom, 6, 0, 2 * Math.PI)

    const ax = this.center().x
    const ay = this.top - 30
    const topCircle = new Path2D()
    topCircle.arc(ax, ay, 6, 0, 2 * Math.PI)

    ctx.beginPath()
    ctx.stroke(ltCircle)
    ctx.stroke(rtCircle)
    ctx.stroke(rbCircle)
    ctx.stroke(lbCircle)
    ctx.stroke(topCircle)
    ctx.stroke(path)
    ctx.closePath()
    ctx.restore()
  }
  isInnerPos(pos: Vector2D): boolean {
    throw new Error('Method not implemented.')
  }
  isInArea(area: RectBounding): boolean {
    throw new Error('Method not implemented.')
  }
  setSelect(): void {
    throw new Error('Method not implemented.')
  }
  unSelect(): void {
    throw new Error('Method not implemented.')
  }
  toggleSelect(): void {
    throw new Error('Method not implemented.')
  }
  move(x: number, y: number): void {
    throw new Error('Method not implemented.')
  }
  getRectBounding(): RectBounding {
    throw new Error('Method not implemented.')
  }
  fillStyle?: string
  strokeStyle?: string
  pos?: Vector2D
  selected?: boolean
}
