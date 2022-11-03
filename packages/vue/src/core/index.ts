import { CanvasEvent } from './EventObserver'
import { Layer } from './Layer'
import Circle from './Shapes/Circle'
import Line from './Shapes/Line'
import Rectangle from './Shapes/Rectangle'
import { SnapshotManager } from './Snapshot'
import { distance, V2D, Vector2D } from './utils/Vector'

/**
 * 暴露所有API, 并且提供各个类之间的上下文，共享数据
 */
export default class WB {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  canvasEvent: CanvasEvent
  layer: Layer
  history: SnapshotManager

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')

    this.canvasEvent = new CanvasEvent(this.canvas)
    this.layer = new Layer(this.ctx)
    this.history = new SnapshotManager(this.layer)
  }

  addCircle(options): Circle {
    const circle = new Circle(options)
    this.layer.push(circle)
    this.history.create()
    return circle
  }

  addRectangle(options): Rectangle {
    const rectangle = new Rectangle(options)
    this.layer.push(rectangle)
    this.history.create()
    return rectangle
  }

  addLine(options): Line {
    const line = new Line(options)
    this.layer.push(line)
    this.history.create()
    return line
  }

  drawShapes() {
    this.layer.drawShapes()
  }

  undo() {
    this.history.undo()
    this.drawShapes()
  }

  redo() {
    this.history.redo()
    this.drawShapes()
  }

  dragToDrawLine() {
    this.canvasEvent.mouseDown((e: MouseEvent) => {
      const begin = m2v(e)

      const line = this.addLine({ begin })
      const move = (e: MouseEvent) => {
        line.end = m2v(e)
        this.layer.drawShapes()
      }
      moveUp(move)
    })
  }

  dragToDrawRectangle() {
    this.canvasEvent.mouseDown((e: MouseEvent) => {
      const rectangle = this.addRectangle({
        position: m2v(e)
      })

      const move = (e: MouseEvent) => {
        rectangle.w = e.offsetX - rectangle.position.x
        rectangle.h = e.offsetY - rectangle.position.y
        this.layer.drawShapes()
      }

      moveUp(move)
    })
  }

  dragToDrawCircle() {
    this.canvasEvent.mouseDown((e: MouseEvent) => {
      const circle = this.addCircle({ position: m2v(e) })

      const move = (e: MouseEvent) => {
        console.log(m2v(e))

        circle.radius = distance(m2v(e), circle.position)
        this.drawShapes()
      }

      moveUp(move)
    })
  }
}

let wb: WB | null = null
export function useWB(canvas?: HTMLCanvasElement) {
  if (wb !== null) {
    return wb
  }
  if (canvas) {
    wb = new WB(canvas)
    return wb
  }
  throw Error('未初始化')
}

/**
 * 添加鼠标移动事件并在抬起时取消
 * @param moveFN
 */
function moveUp(moveFN) {
  window.addEventListener('mousemove', moveFN)
  window.addEventListener(
    'mouseup',
    () => {
      window.removeEventListener('mousemove', moveFN)
    },
    { once: true }
  )
}

/**
 * mouse position to vector
 * @param e MouseEvent
 * @returns
 */
function m2v(e: MouseEvent): Vector2D {
  const { x, y } = new V2D(e.offsetX, e.offsetY)
  return { x, y }
}

function calcCanvasCoordinate(
  e: MouseEvent,
  canvas: HTMLCanvasElement
): Vector2D {
  const x = e.clientX - canvas.getBoundingClientRect().left
  const y = e.clientY - canvas.getBoundingClientRect().top
  return { x, y }
}
