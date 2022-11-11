import type { CtxSetting } from '.'

export abstract class BaseShape {
  ctxSetting: CtxSetting = {
    fillStyle: 'rgba(0,0,0,0)',
    strokeStyle: 'black'
  }
  protected setCtxStyle(ctx: CanvasRenderingContext2D) {
    this.assign(ctx, this.ctxSetting)
  }
  protected assign(a: any, b: any) {
    Object.assign(a, JSON.parse(JSON.stringify(b)))
  }
}
