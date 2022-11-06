export function createCanvas(): HTMLCanvasElement {
  return document.createElement('canvas')
}

export function createCtx(): CanvasRenderingContext2D {
  const canvas = createCanvas()
  canvas.width = 800
  canvas.height = 450
  const ctx = canvas.getContext('2d')
  return ctx!
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function drawNoSideEffect(ctx: CanvasRenderingContext2D) {
  return (cb: (ctx: CanvasRenderingContext2D) => void) => {
    ctx.save()
    ctx.beginPath()
    cb(ctx)
    ctx.closePath()
    ctx.restore()
  }
}

export function drawAsEraser(ctx: CanvasRenderingContext2D, path: Path2D) {
  drawNoSideEffect(ctx)(ctx => {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fill(path)
  })
}
