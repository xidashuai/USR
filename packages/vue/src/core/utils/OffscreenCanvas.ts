export default class OffscreenCanvas {
  constructor(width?: number, height?: number) {
    this.cache = document.createElement('canvas')
    if (width) this.cache.width = width
    if (height) this.cache.height = height
    this.cacheCtx = this.cache.getContext('2d')
  }
  cache: HTMLCanvasElement
  cacheCtx: CanvasRenderingContext2D

  drawCache(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.drawImage(this.cache, x, y)
  }

  useCacheCtx(fn: (ctx: CanvasRenderingContext2D) => void) {
    fn(this.cacheCtx)
  }
}
