import { CanvasEvent } from './EventObserver'
import { Layer } from './Layer'
import {
  Brush,
  BrushOptions,
  Circle,
  CircleOptions,
  Line,
  LineOptions,
  Oval,
  OvalOptions,
  Rectangle,
  RectangleOptions,
  Shape
} from './Shapes'
import { SnapshotManager } from './Snapshot'
import { calcMousePos, moveUp } from './utils/events'
import { calcRectBounding, distance, Vector2D } from './utils/Vector'

/**
 * 暴露所有API, 并且提供各个类之间的上下文，共享数据
 * 记得在修改状态之前创建快照
 */
export default class WhiteBoard {
  readonly canvas: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  readonly canvasEvent: CanvasEvent
  readonly layer: Layer
  readonly history: SnapshotManager

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')

    this.canvasEvent = new CanvasEvent(this.canvas)
    this.layer = new Layer(this.ctx)
    this.history = new SnapshotManager(this.layer)
  }
  addSnapshot() {
    this.history.addSnapshot()
  }

  addCircle(options: CircleOptions): Circle {
    this.addSnapshot()
    const circle = new Circle(options)
    this.layer.push(circle)
    return circle
  }

  addRectangle(options: RectangleOptions): Rectangle {
    this.addSnapshot()
    const rectangle = new Rectangle(options)
    this.layer.push(rectangle)
    return rectangle
  }

  addLine(options: LineOptions): Line {
    this.addSnapshot()
    const line = new Line(options)
    this.layer.push(line)
    return line
  }

  addOval(options: OvalOptions): Oval {
    this.addSnapshot()
    const oval = new Oval(options)
    this.layer.push(oval)
    return oval
  }

  addBrush(options: BrushOptions): Brush {
    this.addSnapshot()
    const brush = new Brush(options)
    this.layer.push(brush)
    return brush
  }

  private getMousePos(e: MouseEvent): Vector2D {
    return calcMousePos(e, this.canvas)
  }

  createCache() {
    this.layer.createCache()
  }
  drawCache() {
    this.layer.drawCache()
  }
  drawShapes() {
    this.layer.drawShapes()
  }

  undo(): void {
    this.history.undo()
    this.drawShapes()
  }

  redo(): void {
    this.history.redo()
    this.drawShapes()
  }

  /**
   * 更换canvas mousedown 事件处理策略,
   * ```javascript
   * // 为了性能，应该在 mousemove 事件前创建缓存
   * this.createCache()
   * // 在mousemove事件中绘制缓存。
   * this.drawCache()
   *
   * // 非性能需求下直接调用
   * this.drawShapes()
   * ```
   * @param fn
   */
  setMouseDown(fn: (this: GlobalEventHandlers, ev: MouseEvent) => any) {
    this.canvasEvent.mouseDown(fn)
  }

  setClick(fn: (this: GlobalEventHandlers, ev: MouseEvent) => any) {
    this.canvasEvent.click(fn)
  }

  /**@todo */
  useSelect() {
    this.setMouseDown((e: MouseEvent) => {
      this.createCache()

      const posMouseDown = this.getMousePos(e)
      let area
      const move = (e: MouseEvent) => {
        this.ctx.save()
        this.drawCache()

        const pos = this.getMousePos(e)
        const areaPath = new Path2D()
        this.ctx.fillStyle = 'rgba(77, 173, 190, 0.3)'
        areaPath.rect(
          posMouseDown.x,
          posMouseDown.y,
          pos.x - posMouseDown.x,
          pos.y - posMouseDown.y
        )
        this.ctx.fill(areaPath)

        area = calcRectBounding(posMouseDown, pos)
        this.ctx.restore()
      }

      moveUp(move, () => {
        this.layer.getShapesInArea(area)
        this.layer.setSelectedStyle()
        this.drawShapes()
        this.useMove()
      })
    })
  }

  useMove() {
    this.setMouseDown((e: MouseEvent) => {
      this.addSnapshot()

      this.layer.setSelectedStyle()
      let pre = this.getMousePos(e)

      const move = (e: MouseEvent) => {
        const cur = this.getMousePos(e)
        this.layer.shapesSelected.forEach(shape => {
          shape.move(cur.x - pre.x, cur.y - pre.y)
          shape.draw(this.ctx)
        })
        pre = cur
        this.drawShapes()
      }

      moveUp(move, () => {
        this.layer.unsetSelectedStyle()
      })
    })
  }

  useDrawLine() {
    this.setMouseDown((e: MouseEvent) => {
      const begin = this.getMousePos(e)
      const line = this.addLine({ begin })

      const move = (e: MouseEvent) => {
        line.end = this.getMousePos(e)
        this.layer.drawShapes()
      }

      moveUp(move)
    })
  }

  useDrawRectangle() {
    this.canvasEvent.mouseDown((e: MouseEvent) => {
      this.layer.createCache()
      this.layer.drawCache()
      const rectangle = this.addRectangle({
        pos: this.getMousePos(e)
      })

      const move = (e: MouseEvent) => {
        this.layer.drawCache()
        rectangle.w = this.getMousePos(e).x - rectangle.pos.x
        rectangle.h = this.getMousePos(e).y - rectangle.pos.y
        rectangle.draw(this.ctx)
      }

      moveUp(move)
    })
  }

  useDrawCircle() {
    this.canvasEvent.mouseDown((e: MouseEvent) => {
      const circle = this.addCircle({ pos: this.getMousePos(e) })

      const move = (e: MouseEvent) => {
        circle.radius = distance(this.getMousePos(e), circle.pos)
        this.layer.drawShapes()
      }

      moveUp(move)
    })
  }

  useDrawOval() {
    this.canvasEvent.mouseDown((e: MouseEvent) => {
      const oval = this.addOval({ pos: this.getMousePos(e) })

      const move = (e: MouseEvent) => {
        oval.radiusX = Math.abs(this.getMousePos(e).x - oval.pos.x)
        oval.radiusY = Math.abs(this.getMousePos(e).y - oval.pos.y)
        this.layer.drawShapes()
      }

      moveUp(move)
    })
  }

  useDrawBrush() {
    this.canvasEvent.mouseDown((e: MouseEvent) => {
      this.createCache()
      const brush = this.addBrush({ vectors: [this.getMousePos(e)] })
      const move = (e: MouseEvent) => {
        this.drawCache()
        const pos = this.getMousePos(e)
        brush.vectors.push(pos)
        brush.draw(this.ctx)
      }

      moveUp(move)
    })
  }
}

let wb: WhiteBoard | null = null
export function useWB(canvas?: HTMLCanvasElement) {
  if (wb !== null) {
    return wb
  }
  if (canvas) {
    wb = new WhiteBoard(canvas)
    return wb
  }
  throw Error('未初始化')
}
