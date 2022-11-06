import type { RectangleBoundingOptions, RectangleOptions, Shape } from '.'
import { clearCanvas } from '../utils/Canvas'
import SelectState from '../utils/SelectState'
import type { RectBounding, Vector2D } from '../utils/Vector'

/**
 * 长方形
 */
export class RectangleBounding
  extends SelectState
  implements Shape, RectangleBoundingOptions
{
  constructor(options?: RectangleOptions | RectBounding) {
    super()
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
    path.closePath()

    const ltCircle = new Path2D()
    ltCircle.arc(this.left, this.top, 6, 0, 2 * Math.PI)
    ltCircle.closePath()

    const rtCircle = new Path2D()
    rtCircle.arc(this.right, this.top, 6, 0, 2 * Math.PI)
    rtCircle.closePath()

    const rbCircle = new Path2D()
    rbCircle.arc(this.right, this.bottom, 6, 0, 2 * Math.PI)
    rbCircle.closePath()

    const lbCircle = new Path2D()
    lbCircle.arc(this.left, this.bottom, 6, 0, 2 * Math.PI)
    lbCircle.closePath()

    const ax = this.center().x
    const ay = this.top - 30
    const topCircle = new Path2D()
    topCircle.arc(ax, ay, 6, 0, 2 * Math.PI)
    topCircle.closePath()

    ctx.stroke(path)
    ctx.stroke(ltCircle)
    ctx.stroke(rtCircle)
    ctx.stroke(rbCircle)
    ctx.stroke(lbCircle)
    ctx.stroke(topCircle)
    ctx.restore()
  }

  isInnerPos(pos: Vector2D): boolean {
    throw new Error('Method not implemented.')
  }

  isInArea(area: RectBounding): boolean {
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
}
