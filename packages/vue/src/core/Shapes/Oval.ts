import type { OvalOptions, Shape } from '.'
import type { Vector2D } from '../utils/vector'

export class Oval implements Shape, OvalOptions {
  constructor(options: OvalOptions) {
    Object.assign(this, JSON.parse(JSON.stringify(options)))
    // Object.assign(this, options)
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
    const path = new Path2D()
    ctx.save()
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
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
}
