import type { Shape } from '.'
import type WB from '..'
import { V2D, Vector2D } from '../utils/Vector'

interface LineOptions {
  begin?: Vector2D
  end?: Vector2D
}
/**
 * 直线
 */
export default class Line implements Shape, LineOptions {
  wb: WB
  begin: Vector2D
  end: Vector2D
  constructor({ begin, end }: LineOptions) {
    this.begin = begin || new V2D()
    this.end = end || new V2D()
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.moveTo(this.begin.x, this.begin.y)
    ctx.lineTo(this.end.x, this.end.y)
    ctx.stroke()
    ctx.closePath()
  }
  dragToDraw(e: MouseEvent) {
    this.begin = new V2D(e.offsetX, e.offsetY)

    this.wb.shapeManager.push(this)
    this.wb.shapeManager.drawShapes()

    const mm = (e: MouseEvent) => {
      this.end.x = e.offsetX
      this.end.y = e.offsetY

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
