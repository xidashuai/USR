import type { BrushOptions, Shape } from '.'
import SelectState from '../utils/SelectState'
import {
  arrayIterator,
  moveVector,
  RectBounding,
  Vector2D
} from '../utils/Vector'

import { brushUrl } from '@/assets'

export class ImageBrush extends SelectState implements Shape {
  constructor(options: BrushOptions) {
    super()
    Object.assign(this, options)
    this.img.src = brushUrl.icicles
  }

  img = new Image()

  vectors?: Vector2D[] = [{ x: 0, y: 0 }]

  cache: HTMLCanvasElement = document.createElement('canvas')
  cacheCtx = this.cache.getContext('2d')

  draw(ctx: CanvasRenderingContext2D): void {
    // const drawImage = (x, y) => {
    //   ctx.drawImage(this.img, x, y, 20, 20)
    // }
    // ctx.save()
    // this.vectors.forEach(v => {
    //   drawImage(v.x, v.y)
    // })
    // ctx.restore()

    ctx.drawImage(this.cache, 0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  useCacheCtx(fn: (ctx: CanvasRenderingContext2D) => void) {
    fn(this.cacheCtx)
  }

  isInnerPos(pos: Vector2D): boolean {
    return false
  }

  isInArea(area: RectBounding): boolean {
    return true
  }

  move(x: number, y: number): void {
    console.log(this.vectors.length)

    this.vectors.forEach(v => {
      moveVector(v, x, y)
    })
  }

  getRectBounding(): RectBounding {
    throw Error('un implement')
  }
}
