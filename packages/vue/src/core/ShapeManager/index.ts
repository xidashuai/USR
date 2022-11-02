import type { Shape } from '@/core/Shapes'
import type { SnapshotOriginator } from '../Snapshot'
import type { SnapshotManager } from '../Snapshot'

/**
 * 管理一个画布中的所有形状
 */
export default class ShapeManager implements SnapshotOriginator {
  ctx: CanvasRenderingContext2D
  shapes: Shape[] = []
  get size() {
    return this.shapes.length
  }
  history: SnapshotManager
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
    this.clearCanvas()
    this.shapes.forEach(shape => {
      shape.draw(this.ctx)
    })
  }
  clearCanvas() {
    const w = this.ctx.canvas.width
    const h = this.ctx.canvas.height
    this.ctx.clearRect(0, 0, w, h)
  }
  createSnapshot() {}
  restore(snapshot) {
    this.shapes = snapshot.shapes
  }
}
