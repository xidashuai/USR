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
  RectangleOptions
} from './Shapes'
import { SnapshotManager } from './Snapshot'
import { calcMousePos, moveUp } from './utils/events'
import { distance, offset, Vector2D } from './utils/vector'

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

  addCircle(options: CircleOptions): Circle {
    this.history.addSnapshot()
    const circle = new Circle(options)
    this.layer.push(circle)
    return circle
  }

  addRectangle(options: RectangleOptions): Rectangle {
    this.history.addSnapshot()
    const rectangle = new Rectangle(options)
    this.layer.push(rectangle)
    return rectangle
  }

  addLine(options: LineOptions): Line {
    this.history.addSnapshot()
    const line = new Line(options)
    this.layer.push(line)
    return line
  }

  addOval(options: OvalOptions): Oval {
    this.history.addSnapshot()
    const oval = new Oval(options)
    this.layer.push(oval)
    return oval
  }

  addBrush(options: BrushOptions): Brush {
    this.history.addSnapshot()
    const brush = new Brush(options)
    this.layer.push(brush)
    return brush
  }

  undo(): void {
    this.history.undo()
    this.layer.drawShapes()
  }

  redo(): void {
    this.history.redo()
    this.layer.drawShapes()
  }

  getMousePos(e: MouseEvent): Vector2D {
    return calcMousePos(e, this.canvas)
  }

  useMouseDown() {
    return {
      drawLine: () => {
        this.canvasEvent.mouseDown((e: MouseEvent) => {
          const begin = this.getMousePos(e)
          const line = this.addLine({ begin })

          const move = (e: MouseEvent) => {
            line.end = this.getMousePos(e)
            this.layer.drawShapes()
          }

          moveUp(move)
        })
      },
      drawRectangle: () => {
        this.canvasEvent.mouseDown((e: MouseEvent) => {
          const rectangle = this.addRectangle({
            pos: this.getMousePos(e)
          })

          const move = (e: MouseEvent) => {
            rectangle.w = this.getMousePos(e).x - rectangle.pos.x
            rectangle.h = this.getMousePos(e).y - rectangle.pos.y
            this.layer.drawShapes()
          }

          moveUp(move)
        })
      },
      drawCircle: () => {
        this.canvasEvent.mouseDown((e: MouseEvent) => {
          const circle = this.addCircle({ pos: this.getMousePos(e) })

          const move = (e: MouseEvent) => {
            circle.radius = distance(this.getMousePos(e), circle.pos)
            this.layer.drawShapes()
          }

          moveUp(move)
        })
      },
      drawOval: () => {
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
    }
  }
}

let whiteboard: WhiteBoard | null = null
export function useWB(canvas?: HTMLCanvasElement) {
  if (whiteboard !== null) {
    return whiteboard
  }
  if (canvas) {
    whiteboard = new WhiteBoard(canvas)
    return whiteboard
  }
  throw Error('未初始化')
}
