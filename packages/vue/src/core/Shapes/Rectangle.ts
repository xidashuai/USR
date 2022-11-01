import type { Shape } from '.'
import type WB from '..'
import { V2D, Vector2D } from '../utils/Vector'

interface RectangleOptions {
  position?: Vector2D
  w?: number
  h?: number
}
/**
 * 长方形
 */
export default class Rectangle implements Shape {
  wb: WB
  position: Vector2D = new V2D()
  w: number = 0
  h: number = 0
  constructor({ position, w, h }: RectangleOptions = {}) {
    this.position = position || new V2D()
    this.w = w || 0
    this.h = h || 0
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.rect(this.position.x, this.position.y, this.w, this.h)
    ctx.stroke()
    ctx.closePath()
  }
  dragToDraw(e: MouseEvent) {
    this.position = new V2D(e.offsetX, e.offsetY)

    this.wb.shapeManager.push(this)
    this.wb.shapeManager.drawShapes()

    const mm = (e: MouseEvent) => {
      this.w = e.offsetX - this.position.x
      this.h = e.offsetY - this.position.y
      this.wb.shapeManager.drawShapes()
    }
    window.addEventListener('mousemove', mm)
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mouseup', mm)
      },
      { once: true }
    )
  }
}
