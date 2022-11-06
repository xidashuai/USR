import type { BrushOptions, Shape } from '.'
import SelectState from '../utils/SelectState'
import type { RectBounding, Vector2D } from '../utils/Vector'

import { brushUrl } from '@/assets'
import { drawCanvasElement } from '../utils/Canvas'

export class ImageBrush extends SelectState implements Shape {
  constructor(options?: BrushOptions) {
    super()
    Object.assign(this, options)
    this.img.src = brushUrl.icicles
  }

  img = new Image()

  vectors?: Vector2D[] = [{ x: 0, y: 0 }]

  cache: HTMLCanvasElement = document.createElement('canvas')
  cacheCtx = this.cache.getContext('2d')

  draw(ctx: CanvasRenderingContext2D): void {
    drawCanvasElement(ctx, this.cache)
  }

  drawImg(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.drawImage(this.img, x, y)
  }

  useCacheCtx(fn: (ctx: CanvasRenderingContext2D) => void) {
    fn(this.cacheCtx)
  }

  isInnerPos(pos: Vector2D): boolean {
    return false
  }

  isInArea(area: RectBounding): boolean {
    return false
  }

  move(x: number, y: number): void {
    throw Error('un implement')
  }

  getRectBounding(): RectBounding {
    throw Error('un implement')
  }
}
