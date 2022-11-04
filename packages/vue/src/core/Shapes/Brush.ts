import { BrushOptions, Circle, Shape } from '.'
import type { Vector2D } from '../utils/Vector'

export class Brush implements Shape, BrushOptions {
  brushShape?: Shape = new Circle({ radius: 10 })
  vectors?: Vector2D[] = [{ x: 0, y: 0 }]
  begin?: Vector2D
  end?: Vector2D
  fillStyle?: string
  strokeStyle?: string

  constructor(options: BrushOptions) {
    Object.assign(this, options)
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const shadowPath = shadow(this.vectors)
    const a = shadowPath.shift()

    const brushPath = new Path2D()
    brushPath.moveTo(a.x, a.y)
    let b = shadowPath.shift()
    let c = shadowPath.shift()
    while (b || c) {
      // 只有两点之间做直线，有三点做贝塞尔曲线
      c
        ? brushPath.quadraticCurveTo(b.x, b.y, c.x, c.y)
        : brushPath.lineTo(b.x, b.y)
      b = shadowPath.shift()
      c = shadowPath.shift()
    }
    ctx.stroke(brushPath)
  }
}

/**提供shift，不改变原数组大小 */
function shadow(arr: any[]) {
  let i = 0
  const shift = () => {
    return arr[i++]
  }
  return { shift }
}
