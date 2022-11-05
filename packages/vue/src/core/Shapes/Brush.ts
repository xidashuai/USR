import type { BrushOptions, Shape } from '.'
import {
  arrayIterator,
  moveVector,
  RectBounding,
  Vector2D
} from '../utils/vector'

export class Brush implements Shape, BrushOptions {
  constructor(options: BrushOptions) {
    Object.assign(this, options)
  }
  vectors?: Vector2D[] = [{ x: 0, y: 0 }]

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
    this.vectors.forEach(v => {
      moveVector(v, x, y)
    })
  }
}

/**提供shift，不改变原数组大小 */
function shadow(arr: any[]) {
  let i = 0
  const shift = () => {
    return arr[i++]
  }
  return { next: shift }
}
