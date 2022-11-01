import type { Shape } from '@/core/Shapes'

/**
 * 管理一个画布中的所有形状
 */
export default class ShapeManager {
  ctx: CanvasRenderingContext2D
  shapes: Shape[] = []
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }
  push(shape: Shape) {
    this.shapes.push(shape)
  }
  pop() {
    return this.shapes.pop()
  }
  remove(shape: Shape) {
    this.shapes = this.shapes.filter(s => s !== shape)
  }
  /**
   * 绘制所有形状
   */
  drawShapes() {
    this.shapes.forEach(shape => {
      shape.draw(this.ctx)
    })
  }
}
