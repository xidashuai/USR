import type { Shape } from '@/core/Shapes'
import type { SnapshotOriginator } from '../Snapshot'
import { SnapshotManager } from '../Snapshot'

/**
 * 管理一个画布中的所有形状
 */
export class Layer implements SnapshotOriginator {
  ctx: CanvasRenderingContext2D
  shapes: Shape[] = []
  get size() {
    return this.shapes.length
  }

  history: SnapshotManager = new SnapshotManager(this)

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  push(shape: Shape) {
    this.history.create()
    this.shapes.push(shape)
  }

  pop() {
    this.history.create()
    return this.shapes.pop()
  }

  remove(shape: Shape) {
    this.history.create()
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

  restore(snapshot) {
    this.shapes = snapshot.shapes
  }

  undo() {
    this.history.undo()
  }

  redo() {
    this.history.redo()
  }
}
