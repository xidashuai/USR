import type { BrushOptions, CtxSetting, ImageBrushOptions, Shape } from '.'
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
import { BaseShape } from './BaseShape'

export class ImageBrush extends BaseShape implements Shape, ImageBrushOptions {
  constructor(options?: ImageBrushOptions) {
    super()
    this.assign(this, options)
    this.img.src = brushUrl.icicles
  }

  readonly type: 'imageBrush' = 'imageBrush'
  pos?: Vector2D = V2D()

  img = new Image()

  offScreenCanvas? = new OffscreenCanvas()
  cache?: any = this.offScreenCanvas.cache

  // cacheCtx? = this.cache.getContext('2d')

  draw(ctx: CanvasRenderingContext2D): void {
    // this.offScreenCanvas.drawCache(ctx, this.pos.x, this.pos.y)
    if (typeof this.cache === 'string') {
      const img = new Image()
      img.src = this.cache
      ctx.drawImage(img, this.pos.x, this.pos.y)
    } else {
      ctx.drawImage(this.cache, this.pos.x, this.pos.y)
    }
  }

  // drawImg(ctx: CanvasRenderingContext2D, x: number, y: number) {
  //   drawNoSideEffect(ctx)(ctx => {
  //     this.assign(ctx, this.ctxSetting)
  //     ctx.drawImage(this.img, x, y)
  //   })
  // }

  // useCacheCtx(fn: (ctx: CanvasRenderingContext2D) => void) {
  //   fn(this.cacheCtx)
  // }

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
