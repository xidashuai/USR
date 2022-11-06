export default class OffscreenCanvas {
  constructor(width: number, height: number) {
    this.cache = document.createElement('canvas')
    this.cache.width = width
    this.cache.height = height
    this.cacheCtx = this.cache.getContext('2d')
  }
  cache: HTMLCanvasElement
  cacheCtx: CanvasRenderingContext2D

  drawCache(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.cache, 0, 0)
  }

  useCacheCtx(fn: (ctx: CanvasRenderingContext2D) => void) {
    fn(this.cacheCtx)
  }
}
