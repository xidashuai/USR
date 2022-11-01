import { CanvasEvent } from './EventObserver'
import ShapeManager from './ShapeManager'
import Circle from './Shapes/Circle'
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
  addCircle(options) {
    const circle = new Circle(options)
    this.shapeManager.push(circle)
    return circle
  }
  addRectangle(options) {
    const rectangle = new Rectangle(options)
    this.shapeManager.push(rectangle)
    return rectangle
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
}

let wb: WB | null = null
export function useWB(canvas?: HTMLCanvasElement) {
  if (canvas) {
    wb = new WB(canvas)
    return wb
  }
  if (wb !== null) {
    return wb
  }
  throw Error('未初始化')
}

// const wb = new WB(canvas)
// wb.canvasEvent.mouseDown((e: MouseEvent) => {
//   const position = new V2D(e.offsetX, e.offsetY)
//   const circle = wb.addCircle({ position })
//   wb.drawShapes()

//   const mousemove = (e: MouseEvent) => {
//     circle.radius = distance()
//   }
//   window.addEventListener('mousemove', mousemove)
//   window.addEventListener(
//     'mouseup',
//     () => {
//       window.removeEventListener('mousemove', mousemove)
//     },
//     { once: true }
//   )
// })

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
