import type { Shape } from '@/core/Shapes'
import _ from 'lodash'
import type { SnapshotOriginator } from '../Snapshot'
import { SnapshotManager } from '../Snapshot'

/**
 * 管理一个画布中的所有形状
 */
export class Layer implements SnapshotOriginator {
  ctx: CanvasRenderingContext2D
  readonly shapes: Shape[] = []

  cache: HTMLCanvasElement
  get size() {
    return this.shapes.length
  }

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  push(shape: Shape) {
    this.shapes.push(shape)
  }

  pop() {
    return this.shapes.pop()
  }

  clear() {
    this.shapes.splice(0, this.shapes.length)
  }

  remove(shape: Shape) {
    this.clear()
    this.shapes.push(...this.shapes.filter(s => s !== shape))
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

  createCache() {
    this.cache = this.renderShapesOffscreen()
  }
  drawCache() {
    this.clearCanvas()
    this.ctx.drawImage(this.cache, 0, 0)
  }
  renderShapesOffscreen() {
    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = this.ctx.canvas.getBoundingClientRect().width
    offscreenCanvas.height = this.ctx.canvas.getBoundingClientRect().height
    const ctx = offscreenCanvas.getContext('2d')

    this.shapes.forEach(shape => {
      shape.draw(ctx)
    })

    return offscreenCanvas
  }

  clearCanvas() {
    const w = this.ctx.canvas.width
    const h = this.ctx.canvas.height
    this.ctx.clearRect(0, 0, w, h)
  }

  snapshot(): Shape[] {
    return _.cloneDeep(this.shapes)
  }

  restore(snapshot: Shape[]) {
    this.clear()
    this.shapes.push(...snapshot)
  }
}
