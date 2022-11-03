import { BrushOptions, Circle, Shape, ShapeOptions } from '.'
import type { Vector2D } from '../utils/vector'

export class Brush implements Shape, BrushOptions {
  brushShape?: Shape = new Circle({ radius: 10 })
  path?: Vector2D[] = [{ x: 0, y: 0 }]
  begin?: Vector2D
  end?: Vector2D
  fill?: string
  stroke?: string
  interval: number = 1
  cache: Vector2D[] = []
  constructor(options: BrushOptions) {
    Object.assign(this, options)
  }
  draw(ctx: CanvasRenderingContext2D): void {
    this.path.forEach(v => {
      this.brushShape.pos = v
      this.brushShape.draw(ctx)
    })
  }
}

const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t
}

function insert(p1: Vector2D, p2: Vector2D) {
  const step = 10
  const result = []
  for (let i = 0; i < step; i++) {
    result.push({
      x: lerp(p1.x, p2.x, i / step),
      y: lerp(p1.y, p2.y, i / step)
    })
  }
  result.push({ ...p2 })

  return result
}
