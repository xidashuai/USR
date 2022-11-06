import type { BrushOptions, Shape } from '.'
import SelectState from '../utils/SelectState'
import {
  arrayIterator,
  moveVector,
  RectBounding,
  Vector2D
} from '../utils/Vector'

export class Brush extends SelectState implements Shape, BrushOptions {
  constructor(options: BrushOptions) {
    super()
    Object.assign(this, options)
  }

  vectors?: Vector2D[] = [{ x: 0, y: 0 }]
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save()

    if (this.selected) {
      ctx.strokeStyle = 'blue'
    }
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
    ctx.restore()
  }

  isInnerPos(pos: Vector2D): boolean {
    return false
  }

  isInArea(area: RectBounding): boolean {
    return false
  }

  move(x: number, y: number): void {
    console.log(this.vectors.length)

    this.vectors.forEach(v => {
      moveVector(v, x, y)
    })
  }

  getRectBounding(): RectBounding {
    throw Error('un implement')
  }
}
