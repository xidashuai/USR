import { CanvasEvent } from './EventObserver'
import { Layer } from './Layer'
import type {
  Brush,
  BrushOptions,
  Circle,
  CircleOptions,
  ImageBrush,
  Line,
  LineOptions,
  Ellipes,
  EllipesOptions,
  Rectangle,
  RectangleOptions,
  ShapeOptions,
  ImageBrushOptions
} from './Shapes'
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

import { brushUrl } from '@/assets'
import { drawNoSideEffect } from './utils/Canvas'
import Path from './utils/Path'
// import { useWB } from '@/stores/useWhiteBoard'
// import { useSocketStore } from '@/stores/useSocket'
// const { socketClient } = useSocketStore()
// import { userStore } from '@/stores/white'
// const { wb } = userStore()

/**
 * 暴露所有API, 并且提供各个类之间的上下文，共享数据
 * 记得在修改状态之前创建快照
 */
export class WhiteBoardPage {
  readonly canvas: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  readonly canvasEvent: CanvasEvent
  readonly layer: Layer
  // readonly history: SnapshotManager

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')

    this.canvasEvent = new CanvasEvent(this.canvas)
    this.layer = new Layer(this.ctx)
    // this.history = new SnapshotManager(this.layer)
  }

  /**
   * 形状
   * @param options
   * @returns
   */
  addShape(
    options:
      | CircleOptions
      | RectangleOptions
      | LineOptions
      | EllipesOptions
      | BrushOptions
      | ImageBrushOptions
  ) {
    return this.layer.addShape(options)
  }

  addCircle(options: CircleOptions): Circle {
    return this.addShape(options) as Circle
  }

  addRectangle(options: RectangleOptions): Rectangle {
    return this.addShape(options) as Rectangle
  }

  addLine(options: LineOptions): Line {
    return this.addShape(options) as Line
  }

  addEllipes(options: EllipesOptions): Ellipes {
    return this.addShape(options) as Ellipes
  }

  addBrush(options: BrushOptions): Brush {
    return this.addShape(options) as Brush
  }

  addImageBrush(options: ImageBrushOptions): ImageBrush {
    const brush = this.addShape(options) as ImageBrush
    brush.offScreenCanvas.cache.width = this.canvas.width
    brush.offScreenCanvas.cache.height = this.canvas.height
    return brush
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

  // setFillStyleOnSelected(fillStyle: string) {
  //   // this.layer.selected.forEach(s => (s.fillStyle = fillStyle))
  //   this.layer.setOnSelected({ fillStyle, strokeStyle: fillStyle },() => {
  //   })
  // }

  undo(): void {
    this.layer.undo()
  }

  redo(): void {
    this.layer.redo()
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
    this.layer.removeSelected()
  }

  sync: () => void = () => {}

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
        this.drawCache()

        const area = calcRectBounding(start, end)
        this.layer.calcShapesInArea(area)

        // 如果没选中, 可重新选择
        if (this.layer.selected.length < 1) {
          this.drawCache()
          this.useSelect()
          return
        }

        // 选中后可移动
        this.layer.drawSelected()
        this.useMove()
      })
    })
  }

  useMove() {
    this.setMouseDown((e: MouseEvent) => {
      this.layer.addSnapshot()
      let pre = this.getMousePos(e)

      const move = (e: MouseEvent) => {
        const cur = this.getMousePos(e)
        this.layer.moveSelected(cur.x - pre.x, cur.y - pre.y)
        this.drawShapes()
        pre = cur
      }

      moveUp(move, () => {
        this.useSelect()
        this.sync()
      })
    })
  }

  useDrawLine() {
    this.setMouseDown((e: MouseEvent) => {
      const begin = this.getMousePos(e)
      const line = this.addLine({
        begin,
        type: 'line',
        ctxSetting: {
          fillStyle: '#00000000',
          strokeStyle: 'red'
        }
      })

      const move = (e: MouseEvent) => {
        line.end = this.getMousePos(e)
        this.layer.drawShapes()
      }

      moveUp(move, () => {
        this.sync()
      })
    })
  }

  useDrawImageBrush(brushType) {
    this.setMouseDown((e: MouseEvent) => {
      const brush = this.addImageBrush({
        type: 'imageBrush'
        // offScreenCanvas: ,
        // cache: undefined,
        // cacheCtx: undefined
      })

      brush.img.src = brushUrl[brushType]

      let start = this.getMousePos(e)
      const leftTop = { ...start }
      const rightBottom = { ...start }

      const move = (e: MouseEvent) => {
        this.layer.drawShapesWithoutSync()
        const end = this.getMousePos(e)

        // 计算路径的边界
        const { x, y } = end
        leftTop.x = Math.min(leftTop.x, x)
        leftTop.y = Math.min(leftTop.y, y)
        rightBottom.x = Math.max(rightBottom.x, x)
        rightBottom.y = Math.max(rightBottom.y, y)

        brush.leftTop = leftTop
        brush.rightBottom = rightBottom

        // 线性插值
        const tempVectors = insert(start, end, calcStep(start, end, 5))

        start = end

        this.drawNoSideEffect()(() => {
          // brush.useCacheCtx(cacheCtx => {
          tempVectors.forEach(v => {
            brush.offScreenCanvas.cacheCtx.drawImage(
              brush.img,
              v.x,
              v.y,
              20,
              20
            )
          })
          // })

          brush.draw(this.ctx)
          this.sync()
        })
      }

      // 贝塞尔曲线插值, 不完善需重构
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
      moveUp(move, () => {
        brush.cache = brush.cache.toDataURL('image/png') as any
        this.sync()
        // socketClient.emit('pages-updated', useWB().wb.export())
      })
    })
  }

  useDrawRectangle() {
    this.setMouseDown((e: MouseEvent) => {
      this.layer.createCache()

      const rectangle = this.addRectangle({
        pos: this.getMousePos(e),
        type: 'rectangle',
        ctxSetting: {
          fillStyle: 'rgba(0,0,0,0)',
          strokeStyle: 'red'
        }
      })

      const move = (e: MouseEvent) => {
        this.layer.drawCache()
        rectangle.w = this.getMousePos(e).x - rectangle.pos.x
        rectangle.h = this.getMousePos(e).y - rectangle.pos.y
        rectangle.draw(this.ctx)
      }

      moveUp(move, () => {
        // const { wb } = useWB()
        this.sync()
      })
    })
  }

  useDrawCircle() {
    this.setMouseDown((e: MouseEvent) => {
      const circle = this.addCircle({
        pos: this.getMousePos(e),
        type: 'circle',
        ctxSetting: undefined
      })

      const move = (e: MouseEvent) => {
        circle.radius = distance(this.getMousePos(e), circle.pos)
        this.layer.drawShapes()
      }

      moveUp(move, () => {
        this.sync()
      })
    })
  }

  useDrawEllipes() {
    this.setMouseDown((e: MouseEvent) => {
      const epllipes = this.addEllipes({
        pos: this.getMousePos(e),
        type: 'ellipes',
        ctxSetting: {
          fillStyle: 'rgba(0,0,0,0)',
          strokeStyle: 'red'
        }
      })

      const move = (e: MouseEvent) => {
        epllipes.radiusX = Math.abs(this.getMousePos(e).x - epllipes.pos.x)
        epllipes.radiusY = Math.abs(this.getMousePos(e).y - epllipes.pos.y)
        this.layer.drawShapes()
      }

      moveUp(move, () => {
        this.sync()
      })
    })
  }

  useDrawBrush() {
    this.setMouseDown((e: MouseEvent) => {
      this.createCache()

      const brush = this.addBrush({
        vectors: [this.getMousePos(e)],
        type: 'brush',
        ctxSetting: undefined
      })

      const pos = this.getMousePos(e)
      const leftTop = { ...pos }
      const rightBottom = { ...pos }

      const move = (e: MouseEvent) => {
        this.drawCache()
        // 计算路径边界
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

      moveUp(move, () => {
        this.sync()
      })
    })
  }
}
