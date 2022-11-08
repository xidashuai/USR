import type { BrushOptions, Shape } from '.'
import {
  areaInOtherArea,
  calcRectBounding,
  moveVector,
  RectBounding,
  V2D,
  Vector2D
} from '../utils/Vector'

import { brushUrl } from '@/assets'
import { drawNoSideEffect } from '../utils/Canvas'
import OffscreenCanvas from '../utils/OffscreenCanvas'

export class ImageBrush implements Shape {
  constructor(options?: BrushOptions) {
    Object.assign(this, options)
    this.img.src = brushUrl.icicles
  }

  type = 'imgBrush'
  img = new Image()

  pos?: Vector2D = V2D()
  vectors?: Vector2D[] = [{ x: 0, y: 0 }]

  offScreenCanvas = new OffscreenCanvas()
  cache: HTMLCanvasElement = this.offScreenCanvas.cache
  cacheCtx = this.cache.getContext('2d')

  draw(ctx: CanvasRenderingContext2D): void {
    this.offScreenCanvas.drawCache(ctx, this.pos.x, this.pos.y)
  }

  drawImg(ctx: CanvasRenderingContext2D, x: number, y: number) {
    drawNoSideEffect(ctx)(ctx => {
      ctx.drawImage(this.img, x, y)
    })
  }

  useCacheCtx(fn: (ctx: CanvasRenderingContext2D) => void) {
    fn(this.cacheCtx)
  }

  isInnerPos(pos: Vector2D): boolean {
    return false
  }

  isInArea(area: RectBounding): boolean {
    return areaInOtherArea(this.getRectBounding(), area)
  }

  move(x: number, y: number): void {
    moveVector(this.pos, x, y)
    moveVector(this.leftTop, x, y)
    moveVector(this.rightBottom, x, y)
  }

  leftTop: Vector2D
  rightBottom: Vector2D
  getRectBounding(): RectBounding {
    return calcRectBounding(this.leftTop, this.rightBottom)
  }
}
