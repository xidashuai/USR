import {
  BrushOptions,
  CircleOptions,
  createShape,
  EllipesOptions,
  ImageBrushOptions,
  LineOptions,
  RectangleOptions,
  Shape,
  ShapeOptionsUnion
} from '@/core/Shapes'
import _ from 'lodash'
import { SnapshotManager, SnapshotOriginator } from '../Snapshot'
import { clearCanvas, drawNoSideEffect } from '../utils/Canvas'
import Path from '../utils/Path'
import type { RectBounding, Vector2D } from '../utils/Vector'

/**
 * 管理一个画布中的所有形状
 */
export class Layer implements SnapshotOriginator {
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.history = new SnapshotManager(this)
    this.shapes = []
  }
  readonly ctx: CanvasRenderingContext2D
  readonly history: SnapshotManager
  readonly shapes: Shape[]
  get size() {
    return this.shapes.length
  }

  addSnapshot(): void {
    if (this.size > 0) {
      this.history.addSnapshot()
    }
  }

  addShape(
    options:
      | BrushOptions
      | CircleOptions
      | EllipesOptions
      | ImageBrushOptions
      | LineOptions
      | RectangleOptions
  ) {
    this.addSnapshot()
    const shape = createShape(options)
    this.shapes.push(shape)
    return shape
  }

  import(shapesOptions: any[]) {
    this.shapes.splice(0, this.size)
    shapesOptions.forEach(s => {
      this.shapes.push(createShape(s))
    })
    // 不能使用drawShapes
    this.clearCanvas()
    this.shapes.forEach(s => {
      s.draw(this.ctx)
    })
  }

  export() {
    return JSON.parse(JSON.stringify(this.shapes))
  }

  pushShape(shape: Shape) {
    this.addSnapshot()
    this.shapes.push(shape)
    return shape
  }

  popShape() {
    this.addSnapshot()
    return this.shapes.pop()
  }

  private removeShape(shape: Shape) {
    _.remove(this.shapes, _shape => _shape === shape)
  }

  clearShapes() {
    this.addSnapshot()
    this.shapes.splice(0, this.shapes.length)
  }

  sync: () => void = () => {}
  /**
   * 绘制所有形状
   */
  drawShapes(afterDraw?: () => {}): void {
    this.clearCanvas()

    this.shapes.forEach(shape => {
      shape.draw(this.ctx)
    })

    // 如果有形状被选中
    if (this.selected.length > 0) {
      this.drawSelected()
    }
  }

  drawShapesWithoutSync() {
    // this.clearCanvas()

    this.shapes.forEach(shape => {
      shape.draw(this.ctx)
    })

    // 如果有形状被选中
    if (this.selected.length > 0) {
      this.drawSelected()
    }
  }

  /**选中的形状：限定能修改的范围 */
  selected: Shape[] = []

  /**
   * 绘制选中形状的边界
   */
  drawSelected() {
    drawNoSideEffect(this.ctx)(ctx => {
      this.selected.forEach(s => {
        const rectBounding = s.getRectBounding()
        const rectBoundingPath = Path.rectBounding(rectBounding)
        ctx.stroke(rectBoundingPath)
      })
    })
  }

  /**
   * 设置未选中任何形状
   */
  setUnSelected() {
    this.selected.splice(0, this.selected.length)
  }

  /**
   * 修改选中形状的配置
   * @param options
   */
  setOnSelected(options, fn?: () => void) {
    this.addSnapshot()
    this.selected.forEach(s => {
      _.assign((s as any).ctxSetting, options)
    })
    this.drawShapes()
    this.drawSelected()
    if (fn) fn()
    this.sync()
  }

  /**
   * 移动选中的形状
   * @param x
   * @param y
   */
  moveSelected(x: number, y: number) {
    this.selected.forEach(shape => {
      shape.move(x, y)
    })
  }

  /**
   * 删除已选中的形状
   */
  removeSelected() {
    this.addSnapshot()
    this.selected.forEach(shape => {
      this.removeShape(shape)
    })

    this.setUnSelected()
    this.drawShapes()
    this.sync()
  }

  /**
   * 得到在给定区域内的形状
   * @param area
   * @returns
   */
  calcShapesInArea(area: RectBounding): Shape[] {
    this.selected = this.shapes.filter(shape => shape.isInArea(area))
    return this.selected
  }

  /**
   * 得到一个在给的位置的形状
   * @param pos
   * @returns
   */
  calcShapeByPos(pos: Vector2D): Shape | null {
    this.setUnSelected()
    _.eachRight(this.shapes, shape => {
      if (shape.isInnerPos(pos)) {
        this.selected.push(shape)
        return shape
      }
    })
    return null
  }

  clearCanvas(): void {
    clearCanvas(this.ctx)
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
    this.shapes.splice(0, this.shapes.length)
    this.shapes.push(...snapshot)
  }

  undo() {
    this.setUnSelected()
    this.history.undo()
    this.drawShapes()
    this.sync()
  }

  redo() {
    this.setUnSelected()
    this.history.redo()
    this.drawShapes()
    this.sync()
  }
}
