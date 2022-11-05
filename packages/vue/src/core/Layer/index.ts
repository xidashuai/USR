import type { Shape } from '@/core/Shapes'
import _ from 'lodash'
import type { SnapshotOriginator } from '../Snapshot'
import type { RectBounding, Vector2D } from '../utils/vector'

/**
 * 管理一个画布中的所有形状
 */
export class Layer implements SnapshotOriginator {
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  readonly ctx: CanvasRenderingContext2D
  readonly shapes: Shape[] = []

  get size() {
    return this.shapes.length
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

  /**限定能修改的形状 */
  shapesSelected: Shape[] = []

  modifySelected(fn: (shapesSelected: Shape[]) => void): void {
    fn(this.shapesSelected)
  }

  clearSelected() {
    this.shapesSelected.splice(0, this.shapesSelected.length)
  }

  getShapesInArea(area: RectBounding): Shape[] {
    this.shapesSelected = this.shapes.filter(shape => shape.isInArea(area))
    return this.shapesSelected
  }

  getShapeByPos(pos: Vector2D): Shape | null {
    this.clearSelected()
    _.eachRight(this.shapes, shape => {
      if (shape.isInnerPos(pos)) {
        this.shapesSelected.push(shape)
        return shape
      }
    })
    return null
  }

  /**
   * 绘制所有形状
   */
  drawShapes(): void {
    this.clearCanvas()
    this.shapes.forEach(shape => {
      shape.draw(this.ctx)
    })
  }

  clearCanvas(): void {
    const w = this.ctx.canvas.width
    const h = this.ctx.canvas.height
    this.ctx.clearRect(0, 0, w, h)
  }

  /**缓存 */
  cache: HTMLCanvasElement

  createCache(): void {
    this.cache = this.renderShapesOffscreen()
  }

  drawCache(): void {
    this.clearCanvas()
    this.ctx.drawImage(this.cache, 0, 0)
  }

  renderShapesOffscreen(): HTMLCanvasElement {
    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = this.ctx.canvas.getBoundingClientRect().width
    offscreenCanvas.height = this.ctx.canvas.getBoundingClientRect().height
    const ctx = offscreenCanvas.getContext('2d')

    this.shapes.forEach(shape => {
      shape.draw(ctx)
    })

    return offscreenCanvas
  }

  /**返回快照 */
  snapshot(): Shape[] {
    return _.cloneDeep(this.shapes)
  }

  /**快照恢复 */
  restore(snapshot: Shape[]) {
    this.clear()
    this.shapes.push(...snapshot)
  }
}

function moveShapes(x: number, y: number, shapes: Shape[]) {
  shapes.forEach(shape => {
    shape.move(x, y)
  })
}
