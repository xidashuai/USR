import { CanvasEvent } from './EventObserver'
import { Layer } from './Layer'
import {
  Brush,
  BrushOptions,
  Circle,
  CircleOptions,
  ImageBrush,
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

import {
  calcRectBounding,
  calcStep,
  distance,
  insert,
  smooth3Vector,
  V2D,
  Vector2D
} from './utils/Vector'

import { brushUrl, logoUrl } from '@/assets'
import { clearCanvas, createCanvas, drawNoSideEffect } from './utils/Canvas'
import Path from './utils/Path'
/**
 * 暴露所有API, 并且提供各个类之间的上下文，共享数据
 * 记得在修改状态之前创建快照
 */
export default class WhiteBoardPage {
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

  addShape(shape) {
    this.addSnapshot()
    this.layer.push(shape)
    return shape
  }

  addCircle(options: CircleOptions): Circle {
    return this.addShape(new Circle(options))
  }

  addRectangle(options: RectangleOptions): Rectangle {
    return this.addShape(new Rectangle(options))
  }

  addLine(options: LineOptions): Line {
    return this.addShape(new Line(options))
  }

  addOval(options: OvalOptions): Oval {
    return this.addShape(new Oval(options))
  }

  addBrush(options: BrushOptions): Brush {
    return this.addShape(new Brush(options))
  }

  addImageBrush(options) {
    const brush = new ImageBrush(options)
    brush.useCacheCtx(cacheCtx => {
      cacheCtx.canvas.width = this.canvas.width
      cacheCtx.canvas.height = this.canvas.height
    })
    return this.addShape(brush)
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

  drawNoSideEffect() {
    return drawNoSideEffect(this.ctx)
  }

  setFillStyleOnSelected(fillStyle: string) {
    this.layer.shapesSelected.forEach(s => (s.fillStyle = fillStyle))
    this.drawShapes()
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
    this.canvasEvent.setMouseDown(fn)
  }

  setClick(fn: (this: GlobalEventHandlers, ev: MouseEvent) => any) {
    this.canvasEvent.setClick(fn)
  }

  private getMousePos(e: MouseEvent): Vector2D {
    return calcMousePos(e, this.canvas)
  }

  removeSelected() {
    this.layer.setStyleAsDefault()
    this.addSnapshot()
    this.layer.removeSelected()
    this.drawShapes()
  }

  useSelect() {
    this.setMouseDown((e: MouseEvent) => {
      this.createCache()

      const start = this.getMousePos(e)
      let end = start

      const move = (e: MouseEvent) => {
        this.drawCache()
        const cur = this.getMousePos(e)

        this.drawNoSideEffect()(ctx => {
          const areaPath = Path.rectangle(
            start,
            cur.x - start.x,
            cur.y - start.y
          )

          ctx.fillStyle = 'rgba(77, 173, 190, 0.3)'
          ctx.fill(areaPath)
        })

        end = cur
      }

      moveUp(move, () => {
        const area = calcRectBounding(start, end)
        this.layer.getShapesInArea(area)

        // 如果没选中, 可重新选择
        if (this.layer.shapesSelected.length < 1) {
          this.drawShapes()
          this.useSelect()
          return
        }

        // 选中后可移动
        this.layer.setStyleAsActived()
        this.drawShapes()
        this.useMove()
      })
    })
  }

  useMove() {
    this.setMouseDown((e: MouseEvent) => {
      // 移动前保存快照
      this.layer.setStyleAsDefault()
      this.addSnapshot()
      this.layer.setStyleAsActived()

      let pre = this.getMousePos(e)
      const move = (e: MouseEvent) => {
        const cur = this.getMousePos(e)
        this.layer.shapesSelected.forEach(shape => {
          shape.move(cur.x - pre.x, cur.y - pre.y)
        })
        pre = cur
        this.drawShapes()
      }

      moveUp(move, () => {
        this.layer.setStyleAsDefault()
        this.useSelect()
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

  useDrawImageBrush(brushType) {
    this.setMouseDown((e: MouseEvent) => {
      this.createCache()

      const brush = this.addImageBrush({})
      brush.img.src = brushUrl[brushType]

      let start = this.getMousePos(e)
      const leftTop = { ...start }
      const rightBottom = { ...start }

      // 线性插值
      const move = (e: MouseEvent) => {
        this.drawCache()
        const end = this.getMousePos(e)

        const { x, y } = end
        leftTop.x = Math.min(leftTop.x, x)
        leftTop.y = Math.min(leftTop.y, y)
        rightBottom.x = Math.max(rightBottom.x, x)
        rightBottom.y = Math.max(rightBottom.y, y)

        brush.leftTop = leftTop
        brush.rightBottom = rightBottom

        const tempVectors = insert(start, end, calcStep(start, end, 5))
        start = end

        this.drawNoSideEffect()(() => {
          brush.useCacheCtx(cacheCtx => {
            tempVectors.forEach(v => {
              cacheCtx.drawImage(brush.img, v.x, v.y, 20, 20)
            })
          })

          brush.draw(this.ctx)
        })
      }
      // 贝塞尔曲线插值
      // let oddTimes = true

      // let ctrl = start

      // const move = (e: MouseEvent) => {
      //   const end = this.getMousePos(e)
      //   oddTimes = !oddTimes

      //   if (oddTimes) {
      //     console.log(
      //       start.x < ctrl.x && start.y < ctrl.y,
      //       ctrl.x < end.x && ctrl.y < end.y
      //     )

      //     const temp = smooth3Vector(start, ctrl, end)
      //     temp.forEach(t => {
      //       this.ctx.drawImage(this.logoImg, t.x, t.y, 10, 10)
      //     })
      //     start = end
      //   } else {
      //     ctrl = this.getMousePos(e)
      //   }
      // }
      moveUp(move)
    })
  }

  useDrawRectangle() {
    this.setMouseDown((e: MouseEvent) => {
      this.layer.createCache()

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
    this.setMouseDown((e: MouseEvent) => {
      const circle = this.addCircle({ pos: this.getMousePos(e) })

      const move = (e: MouseEvent) => {
        circle.radius = distance(this.getMousePos(e), circle.pos)
        this.layer.drawShapes()
      }

      moveUp(move)
    })
  }

  useDrawOval() {
    this.setMouseDown((e: MouseEvent) => {
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
    this.setMouseDown((e: MouseEvent) => {
      this.createCache()

      const brush = this.addBrush({ vectors: [this.getMousePos(e)] })

      const pos = this.getMousePos(e)
      const leftTop = { ...pos }
      const rightBottom = { ...pos }

      const move = (e: MouseEvent) => {
        this.drawCache()
        const pos = this.getMousePos(e)
        const { x, y } = pos
        leftTop.x = Math.min(leftTop.x, x)
        leftTop.y = Math.min(leftTop.y, y)
        rightBottom.x = Math.max(rightBottom.x, x)
        rightBottom.y = Math.max(rightBottom.y, y)
        brush.vectors.push(pos)
        brush.leftTop = leftTop
        brush.rightBottom = rightBottom

        this.drawNoSideEffect()(ctx => {
          brush.draw(ctx)
        })
      }

      moveUp(move)
    })
  }
}

let wb: WhiteBoardPage | null = null

export function useWB(canvas?: HTMLCanvasElement) {
  if (wb !== null) {
    return wb
  }
  if (canvas) {
    wb = new WhiteBoardPage(canvas)
    return wb
  }
  throw Error('未初始化')
}

export class WhiteBoard {
  pages: Map<string, WhiteBoardPage> = new Map()
  defaultWidth = 1206
  defaultHeight = 800

  currentPageID: string

  newId() {
    return newID().toString()
  }

  ids() {
    return [...this.pages.keys()]
  }

  constructor() {
    const id = this.newId()
    this.currentPageID = id
    this.newPage(id)
  }

  newPage(id?: string) {
    const canvas = createCanvas(this.defaultWidth, this.defaultHeight)
    canvas.classList.add('canvas')
    canvas.setAttribute(
      'style',
      `
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: ${this.defaultWidth}px;
      height: ${this.defaultHeight}px;
      background:white;
    `
    )
    const page = new WhiteBoardPage(canvas)

    if (id) {
      this.pages.set(id, page)
    } else {
      this.pages.set(this.newId().toString(), page)
    }
    return page
  }

  deletePage(id: string): void {
    this.pages.delete(id)
  }

  getPage(id: string) {
    return this.pages.get(id)
  }

  getCurrentPage() {
    return this.pages.get(this.currentPageID)
  }
}

let id = 0
function newID() {
  return id++
}
