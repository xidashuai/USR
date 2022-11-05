import { test, expect } from 'vitest'
import { Layer } from './index'
import { Rectangle, Shape } from '../Shapes'
import { createCtx } from '@/core/utils/canvas'
import _ from 'lodash'

const ctx = createCtx()

const rect = new Rectangle()
const layer = new Layer(ctx!)

test('push', () => {
  expect(layer.ctx).toBeDefined()
  layer.push(rect)
  expect(layer.size).toBe(1)
})

test('pop', () => {
  layer.pop()
  expect(layer.size).toBe(0)
})

test('remove', () => {
  layer.push(rect)
  expect(layer.size).toBe(1)
  layer.remove(rect)
  expect(layer.size).toBe(0)
})

// export class Layer implements SnapshotOriginator {
//   ctx: CanvasRenderingContext2D
//   readonly shapes: Shape[] = []
//   get size() {
//     return this.shapes.length
//   }

//   constructor(ctx: CanvasRenderingContext2D) {
//     this.ctx = ctx
//   }

//   push(shape: Shape) {
//     this.shapes.push(shape)
//   }

//   pop() {
//     return this.shapes.pop()
//   }

//   clear() {
//     this.shapes.splice(0, this.shapes.length)
//   }

//   remove(shape: Shape) {
//     this.clear()
//     this.shapes.push(...this.shapes.filter(s => s !== shape))
//   }

//   /**
//    * 绘制所有形状
//    */
//   drawShapes() {
//     this.clearCanvas()
//     this.shapes.forEach(shape => {
//       shape.draw(this.ctx)
//     })
//   }

//   clearCanvas() {
//     const w = this.ctx.canvas.width
//     const h = this.ctx.canvas.height
//     this.ctx.clearRect(0, 0, w, h)
//   }

//   snapshot(): Shape[] {
//     return _.cloneDeep(this.shapes)
//   }

//   restore(snapshot: Shape[]) {
//     this.clear()
//     this.shapes.push(...snapshot)
//   }
// }

function layerFP(_ctx: CanvasRenderingContext2D) {
  const shapes: Shape[] = []

  function shapesSize() {
    return shapes.length
  }

  function push(shape: Shape) {
    shapes.push(shape)
  }

  function popShape() {
    return shapes.pop()
  }

  function topShape() {
    return shapes[shapes.length - 1]
  }

  function clearShapes() {
    shapes.splice(0, shapes.length)
  }

  function remove(shape: Shape) {
    clearShapes()
    shapes.push(...shapes.filter(s => s !== shape))
  }

  /**
   * 绘制所有形状
   */
  function drawShapes() {
    clearCanvas(ctx)
    shapes.forEach(shape => {
      shape.draw(ctx)
    })
  }

  function clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  function snapshot(): Shape[] {
    return _.cloneDeep(shapes)
  }

  function restore(snapshot: Shape[]) {
    clearShapes()
    shapes.push(...snapshot)
  }
  return { snapshot, restore }
}

function renderOffscreen(levelData) {
  const offscreenCanvas = document.createElement('canvas')
  const ctx = offscreenCanvas.getContext('2d')

  // render terrain here...
  const redertask = (ctx: CanvasRenderingContext2D) => {
    return levelData.drawShapes
  }

  return offscreenCanvas
}
