import { CanvasEvent } from './EventObserver'
import ShapeManager from './ShapeManager'
import Circle from './Shapes/Circle'
import Line from './Shapes/Line'
import Rectangle from './Shapes/Rectangle'
import { V2D } from './utils/Vector'

/**
 * 暴露所有API, 并且提供各个类之间的上下文，共享数据
 */
export default class WB {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  canvasEvent: CanvasEvent
  shapeManager: ShapeManager
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')

    this.canvasEvent = new CanvasEvent(this.canvas)
    this.shapeManager = new ShapeManager(this.ctx)
  }
  addCircle(options): Circle {
    const circle = new Circle(options)
    this.shapeManager.push(circle)
    return circle
  }
  addRectangle(options): Rectangle {
    const rectangle = new Rectangle(options)
    this.shapeManager.push(rectangle)
    return rectangle
  }
  addLine(options): Line {
    const line = new Line(options)
    this.shapeManager.push(line)
    return line
  }
  drawShapes() {
    this.shapeManager.drawShapes()
  }
  click(fn) {
    this.canvasEvent.click(fn)
  }
  mouseDown(fn) {
    this.canvasEvent.mouseDown(fn)
  }
  dragToDrawRectangle(e: MouseEvent) {
    const position = new V2D(e.offsetX, e.offsetY)
    const rectangle = this.addRectangle({ position })
    const move = (e: MouseEvent) => {
      rectangle.w = e.offsetX - rectangle.position.x
      rectangle.h = e.offsetY - rectangle.position.y
      this.shapeManager.drawShapes()
    }
    moveUp(move)
  }
  dragToDrawLine(e: MouseEvent) {
    const begin = new V2D(e.offsetX, e.offsetY)
    const line = this.addLine({ begin })
    const move = (e: MouseEvent) => {
      line.end.x = e.offsetX
      line.end.y = e.offsetY
      this.shapeManager.drawShapes()
    }
    moveUp(move)
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
